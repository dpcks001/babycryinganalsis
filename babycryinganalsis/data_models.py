"""Shared dataclasses and helpers for the Baby Crying Analysis app."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List

try:  # pandas is optional for CLI previews
    import pandas as pd
except ModuleNotFoundError:  # pragma: no cover - executed only without pandas
    pd = None  # type: ignore


@dataclass
class FeatureVector:
    """Quantitative measurements extracted from an audio clip."""

    duration: float
    zero_crossing_rate: float
    spectral_centroid: float
    spectral_rolloff: float
    rms: float
    pitch: float

    def to_dict(self) -> Dict[str, float]:
        return {
            "duration": self.duration,
            "zero_crossing_rate": self.zero_crossing_rate,
            "spectral_centroid": self.spectral_centroid,
            "spectral_rolloff": self.spectral_rolloff,
            "rms": self.rms,
            "pitch": self.pitch,
        }


@dataclass
class AnalysisResult:
    """Full result for a single audio inference."""

    label: str
    confidence: float
    reasoning: str
    features: FeatureVector
    timestamp: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> Dict[str, float | str]:
        payload = {
            "label": self.label,
            "confidence": self.confidence,
            "reasoning": self.reasoning,
            "timestamp": self.timestamp.isoformat(),
        }
        payload.update(self.features.to_dict())
        return payload


@dataclass
class AnalysisHistory:
    """Container that keeps track of previous predictions for the session."""

    records: List[AnalysisResult] = field(default_factory=list)

    def add(self, result: AnalysisResult) -> None:
        self.records.append(result)

    def as_records(self) -> List[Dict[str, float | str]]:
        return [record.to_dict() for record in self.records]

    def as_dataframe(self):  # type: ignore[override]
        if pd is None:
            raise ImportError("pandas is required to build a DataFrame of analysis records.")
        return pd.DataFrame(self.as_records())

    def top_labels(self, n: int = 3) -> List[str]:
        if not self.records:
            return []
        counts = Counter(record.label for record in self.records)
        return [label for label, _ in counts.most_common(n)]
