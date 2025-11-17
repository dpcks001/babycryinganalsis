"""Shared dataclasses and helpers for the Baby Crying Analysis app."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List

import pandas as pd


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

    def as_dataframe(self) -> pd.DataFrame:
        return pd.DataFrame([record.to_dict() for record in self.records])

    def top_labels(self, n: int = 3) -> List[str]:
        if not self.records:
            return []
        df = self.as_dataframe()
        return (
            df["label"].value_counts().head(n).reset_index()["index"].tolist()
        )
