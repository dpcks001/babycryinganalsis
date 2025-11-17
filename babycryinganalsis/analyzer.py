"""Audio analysis helpers implemented in pure Python."""

from __future__ import annotations

import io
import random
from typing import Dict, Tuple

import librosa
import numpy as np

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


def _estimate_pitch(y: np.ndarray, sr: int) -> float:
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    max_idx = magnitudes.argmax()
    if max_idx == 0:
        return 0.0
    pitch = pitches.flatten()[max_idx]
    return float(pitch)


def extract_features(y: np.ndarray, sr: int) -> FeatureVector:
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
    audio_buffer = io.BytesIO(file_bytes)
    y, sr = librosa.load(audio_buffer, sr=22050, mono=True)
    if not y.size:
        raise ValueError("Audio stream appears to be empty.")
    features = extract_features(y, sr)
    label, confidence = _score_label(features, thresholds)
    reasoning = _reasoning(label, features)
    return AnalysisResult(label=label, confidence=confidence, reasoning=reasoning, features=features)


def summarize_history(history: AnalysisHistory) -> Dict[str, float | str]:
    if not history.records:
        return {"message": "No analyses have been run yet."}
    df = history.as_dataframe()
    summary = {
        "total": len(history.records),
        "avg_duration": round(float(df["duration"].mean()), 2),
        "avg_pitch": round(float(df["pitch"].mean()), 1),
        "avg_rms": round(float(df["rms"].mean()), 3),
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
