"""Audio analysis helpers implemented in pure Python."""

from __future__ import annotations

import audioop
import io
import math
import random
import wave
from statistics import mean
from typing import Dict, Iterable, Tuple

try:  # numpy/librosa are optional for environments without scientific wheels
    import numpy as np
except ModuleNotFoundError:  # pragma: no cover - executed when numpy is unavailable
    np = None  # type: ignore

try:
    import librosa
except ModuleNotFoundError:  # pragma: no cover - executed when librosa is unavailable
    librosa = None  # type: ignore

from .data_models import AnalysisHistory, AnalysisResult, FeatureVector

DEFAULT_THRESHOLDS: Dict[str, float] = {
    "hunger_pitch": 380.0,
    "discomfort_rolloff": 4200.0,
    "pain_rms": 0.22,
    "soothe_zcr": 0.08,
}

LABEL_EXPLANATIONS = {
    "Hunger": "Higher sustained pitch with moderate energy often indicates the baby wants to be fed.",
    "Discomfort": "Mid-frequency energy spikes and high spectral roll-off tend to match wet diaper or temperature issues.",
    "Pain": "Loud, sharp cries with strong RMS power and irregular pitch usually map to pain or illness.",
    "Self-soothing": "Lower volume with rhythmic pauses often means the baby is attempting to settle down on their own.",
}


def _estimate_pitch(y, sr: int) -> float:
    if np is None or librosa is None:
        return 0.0
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    max_idx = magnitudes.argmax()
    if max_idx == 0:
        return 0.0
    pitch = pitches.flatten()[max_idx]
    return float(pitch)


def _extract_features_librosa(y, sr: int) -> FeatureVector:
    duration = y.shape[0] / sr
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y)))
    centroid = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
    rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)))
    rms = float(np.mean(librosa.feature.rms(y=y)))
    pitch = _estimate_pitch(y, sr)
    return FeatureVector(
        duration=duration,
        zero_crossing_rate=zcr,
        spectral_centroid=centroid,
        spectral_rolloff=rolloff,
        rms=rms,
        pitch=pitch,
    )


def _normalize_samples(raw_samples: Iterable[int], sample_width: int) -> list[float]:
    max_value = float(1 << (8 * sample_width - 1))
    return [sample / max_value for sample in raw_samples]


def _extract_features_basic(samples: list[float], sr: int) -> FeatureVector:
    total_samples = len(samples)
    duration = total_samples / sr if sr else 0.0
    if total_samples == 0:
        raise ValueError("Audio stream appears to be empty.")
    rms = math.sqrt(sum(sample ** 2 for sample in samples) / total_samples)
    zero_crossings = sum(
        1
        for idx in range(1, total_samples)
        if (samples[idx - 1] <= 0.0 < samples[idx])
        or (samples[idx - 1] >= 0.0 > samples[idx])
    )
    zcr = zero_crossings / max(total_samples - 1, 1)
    avg_abs = sum(abs(sample) for sample in samples) / total_samples
    centroid = 500.0 + avg_abs * 3000.0
    rolloff = centroid + avg_abs * 4000.0
    pitch = min((zero_crossings / max(duration, 1e-6)) * 0.5, 900.0)
    return FeatureVector(
        duration=duration,
        zero_crossing_rate=zcr,
        spectral_centroid=centroid,
        spectral_rolloff=rolloff,
        rms=rms,
        pitch=pitch,
    )


def _load_wav_samples(file_bytes: bytes) -> Tuple[list[float], int]:
    try:
        with wave.open(io.BytesIO(file_bytes)) as wav_file:
            sr = wav_file.getframerate()
            frames = wav_file.readframes(wav_file.getnframes())
            sample_width = wav_file.getsampwidth()
            channels = wav_file.getnchannels()
    except wave.Error as exc:  # pragma: no cover - depends on runtime input
        raise ValueError("Only uncompressed WAV data can be previewed in this environment.") from exc

    if channels > 1:
        frames = audioop.tomono(frames, sample_width, 0.5, 0.5)

    total_samples = len(frames) // sample_width
    raw_samples = [audioop.getsample(frames, sample_width, idx) for idx in range(total_samples)]
    samples = _normalize_samples(raw_samples, sample_width)
    return samples, sr


def _score_label(features: FeatureVector, thresholds: Dict[str, float]) -> Tuple[str, float]:
    hunger_score = min(features.pitch / (thresholds["hunger_pitch"] + 1e-6), 1.5)
    discomfort_score = min(
        features.spectral_rolloff / (thresholds["discomfort_rolloff"] + 1e-6),
        1.5,
    )
    pain_score = min(features.rms / (thresholds["pain_rms"] + 1e-6), 1.5)
    soothe_score = max(1.0 - features.zero_crossing_rate / (thresholds["soothe_zcr"] + 1e-6), 0.0)

    scores = {
        "Hunger": hunger_score,
        "Discomfort": discomfort_score,
        "Pain": pain_score,
        "Self-soothing": soothe_score,
    }
    label = max(scores, key=scores.get)
    confidence = min(scores[label] / 1.5, 0.99)
    return label, confidence


def _reasoning(label: str, features: FeatureVector) -> str:
    explanation = LABEL_EXPLANATIONS.get(label, "General crying pattern detected.")
    return (
        f"{explanation} (pitch={features.pitch:.0f}Hz, rms={features.rms:.2f}, "
        f"roll-off={features.spectral_rolloff:.0f}Hz)"
    )


def analyze_audio_bytes(
    file_bytes: bytes, thresholds: Dict[str, float] | None = None
) -> AnalysisResult:
    """Analyze a blob of audio data and return a result."""

    thresholds = thresholds or DEFAULT_THRESHOLDS

    if librosa is not None and np is not None:
        audio_buffer = io.BytesIO(file_bytes)
        y, sr = librosa.load(audio_buffer, sr=22050, mono=True)
        if not y.size:
            raise ValueError("Audio stream appears to be empty.")
        features = _extract_features_librosa(y, sr)
    else:
        samples, sr = _load_wav_samples(file_bytes)
        features = _extract_features_basic(samples, sr)
    label, confidence = _score_label(features, thresholds)
    reasoning = _reasoning(label, features)
    return AnalysisResult(label=label, confidence=confidence, reasoning=reasoning, features=features)


def summarize_history(history: AnalysisHistory) -> Dict[str, float | str]:
    if not history.records:
        return {"message": "No analyses have been run yet."}
    rows = history.as_records()
    summary = {
        "total": len(history.records),
        "avg_duration": round(mean(row["duration"] for row in rows), 2),
        "avg_pitch": round(mean(row["pitch"] for row in rows), 1),
        "avg_rms": round(mean(row["rms"] for row in rows), 3),
        "top_labels": ", ".join(history.top_labels()),
    }
    return summary


def generate_synthetic_features() -> FeatureVector:
    """Create pseudo-random features for demo mode."""

    return FeatureVector(
        duration=random.uniform(4.0, 12.0),
        zero_crossing_rate=random.uniform(0.02, 0.12),
        spectral_centroid=random.uniform(800.0, 4000.0),
        spectral_rolloff=random.uniform(2000.0, 8000.0),
        rms=random.uniform(0.05, 0.5),
        pitch=random.uniform(180.0, 650.0),
    )


def fake_result() -> AnalysisResult:
    features = generate_synthetic_features()
    label, confidence = _score_label(features, DEFAULT_THRESHOLDS)
    reasoning = _reasoning(label, features)
    return AnalysisResult(label=label, confidence=confidence, reasoning=reasoning, features=features)
