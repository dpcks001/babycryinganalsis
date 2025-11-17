"""CLI preview for the Baby Crying Analysis experience."""

from __future__ import annotations

import argparse
import random
import textwrap

from babycryinganalsis import AnalysisHistory
from babycryinganalsis.analyzer import fake_result, summarize_history


def _build_history(records: int, seed: int | None) -> AnalysisHistory:
    if seed is not None:
        random.seed(seed)
    history = AnalysisHistory()
    for _ in range(records):
        history.add(fake_result())
    return history


def _format_row(index: int, payload: dict[str, float | str]) -> str:
    return f"{index:>2} | {payload['label']:<12} | {payload['confidence'] * 100:>6.1f}% | " \
        f"{payload['duration']:>6.1f}s | {payload['pitch']:>6.0f}Hz | {payload['rms']:.3f}"


def _render_preview(history: AnalysisHistory) -> str:
    records = history.as_records()
    summary = summarize_history(history)
    if "message" in summary:
        return "No analyses yet. Use --records to generate demo data."

    lines = [
        "Baby Crying Analysis – Python Preview",
        "=" * 52,
        f"Total analyses : {summary['total']}",
        f"Avg duration    : {summary['avg_duration']:.1f}s",
        f"Avg pitch       : {summary['avg_pitch']:.0f}Hz",
        f"Avg RMS         : {summary['avg_rms']}",
        f"Top labels      : {summary['top_labels']}",
        "",
        "Recent analyses (label | confidence | duration | pitch | rms)",
        "--",
    ]

    for idx, row in enumerate(records[-5:], start=max(1, len(records) - 4)):
        lines.append(_format_row(idx, row))

    last = records[-1]
    lines.extend(
        [
            "",
            "Most recent reasoning:",
            textwrap.fill(last["reasoning"], width=70),
        ]
    )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--records", type=int, default=4, help="Number of demo analyses to fabricate")
    parser.add_argument("--seed", type=int, default=None, help="Random seed for deterministic previews")
    args = parser.parse_args()

    history = _build_history(max(0, args.records), args.seed)
    print(_render_preview(history))


if __name__ == "__main__":
    main()
