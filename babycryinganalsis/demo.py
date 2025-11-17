"""Utilities to provide demo data without real audio recordings."""

from __future__ import annotations

import io
import wave
from typing import List

import numpy as np


def generate_sine_wave(duration: float = 5.0, frequency: float = 300.0, sr: int = 22050) -> bytes:
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    data = 0.3 * np.sin(2 * np.pi * frequency * t)
    pcm = np.int16(data / np.max(np.abs(data)) * 32767)
    with io.BytesIO() as buffer:
        with wave.open(buffer, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sr)
            wav_file.writeframes(pcm.tobytes())
        return buffer.getvalue()


def build_demo_playlist() -> List[bytes]:
    """Return a list of ready-to-use audio blobs for demo mode."""

    return [
        generate_sine_wave(frequency=280.0),
        generate_sine_wave(frequency=420.0),
        generate_sine_wave(frequency=520.0),
    ]
