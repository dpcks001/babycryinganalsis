"""Streamlit entry point for the Baby Crying Analysis experience."""

from __future__ import annotations

from typing import Dict

import pandas as pd
import streamlit as st

from babycryinganalsis import (
    AnalysisHistory,
    analyze_audio_bytes,
    summarize_history,
)
from babycryinganalsis.analyzer import DEFAULT_THRESHOLDS, fake_result
from babycryinganalsis.demo import build_demo_playlist

st.set_page_config(
    page_title="Baby Crying Analysis",
    page_icon="👶",
    layout="wide",
)

if "history" not in st.session_state:
    st.session_state.history = AnalysisHistory()
if "thresholds" not in st.session_state:
    st.session_state.thresholds = DEFAULT_THRESHOLDS.copy()
if "demo_index" not in st.session_state:
    st.session_state.demo_index = 0

history: AnalysisHistory = st.session_state.history


def _render_sidebar() -> str:
    st.sidebar.title("Controls")
    nav = st.sidebar.radio(
        "Navigation",
        ["대시보드", "처리 현황", "통계", "설정"],
        index=0,
    )
    st.sidebar.markdown("---")
    st.sidebar.subheader("Thresholds")
    thresholds: Dict[str, float] = st.session_state.thresholds
    thresholds["hunger_pitch"] = st.sidebar.slider(
        "Hunger pitch (Hz)", 250.0, 600.0, thresholds["hunger_pitch"], step=5.0
    )
    thresholds["discomfort_rolloff"] = st.sidebar.slider(
        "Discomfort roll-off (Hz)", 2000.0, 9000.0, thresholds["discomfort_rolloff"], step=50.0
    )
    thresholds["pain_rms"] = st.sidebar.slider(
        "Pain RMS",
        0.05,
        0.6,
        float(thresholds["pain_rms"]),
        step=0.01,
    )
    thresholds["soothe_zcr"] = st.sidebar.slider(
        "Self-soothing ZCR",
        0.01,
        0.25,
        float(thresholds["soothe_zcr"]),
        step=0.005,
    )
    st.sidebar.caption("모든 분석은 로컬에서 실행됩니다.")
    return nav


def _analyze_uploaded_file(uploaded_file) -> None:
    if uploaded_file is None:
        st.warning("먼저 오디오 파일을 업로드해주세요.")
        return
    audio_bytes = uploaded_file.getvalue()
    _run_analysis(audio_bytes, uploaded_file.name)


def _run_analysis(audio_bytes: bytes, label: str) -> None:
    with st.spinner("오디오를 분석하는 중입니다..."):
        result = analyze_audio_bytes(audio_bytes, thresholds=st.session_state.thresholds)
    history.add(result)
    st.success(f"{label} 분석 완료")
    _render_result_card(result)


def _render_result_card(result) -> None:
    st.subheader("결과 요약")
    cols = st.columns(3)
    cols[0].metric("추정 상태", result.label)
    cols[1].metric("신뢰도", f"{result.confidence * 100:.1f}%")
    cols[2].metric("길이", f"{result.features.duration:.1f}s")
    st.write(result.reasoning)
    st.json(result.features.to_dict())


@st.cache_data(show_spinner=False)
def _history_dataframe(history: AnalysisHistory) -> pd.DataFrame:
    if not history.records:
        return pd.DataFrame()
    return history.as_dataframe()


def _render_dashboard() -> None:
    st.title("👶 Baby Crying Analysis (Python)")
    st.write("업로드된 오디오를 AI 없이 순수 Python으로 분석합니다.")

    uploaded_file = st.file_uploader("오디오 파일 업로드 (WAV/MP3)", type=["wav", "mp3", "ogg"])
    cols = st.columns(2)
    if cols[0].button("분석 실행", use_container_width=True):
        _analyze_uploaded_file(uploaded_file)

    if cols[1].button("데모 오디오 사용", use_container_width=True):
        playlist = build_demo_playlist()
        blob = playlist[st.session_state.demo_index % len(playlist)]
        st.session_state.demo_index += 1
        _run_analysis(blob, label="데모 파일")

    if history.records:
        st.markdown("---")
        st.subheader("최근 분석")
        last = history.records[-1]
        _render_result_card(last)


def _render_processing() -> None:
    st.title("처리 현황")
    if not history.records:
        st.info("아직 처리된 항목이 없습니다.")
        return
    df = _history_dataframe(history)
    st.dataframe(df.tail(10), use_container_width=True)
    st.download_button(
        label="CSV 다운로드",
        data=df.to_csv(index=False).encode("utf-8"),
        file_name="analysis_history.csv",
        mime="text/csv",
    )


def _render_statistics() -> None:
    st.title("통계")
    if not history.records:
        st.info("분석 기록이 필요합니다.")
        return
    summary = summarize_history(history)
    cols = st.columns(4)
    cols[0].metric("총 분석", summary["total"])
    cols[1].metric("평균 길이", f"{summary['avg_duration']:.1f}s")
    cols[2].metric("평균 피치", f"{summary['avg_pitch']:.0f}Hz")
    cols[3].metric("평균 RMS", summary["avg_rms"])
    st.write(f"주요 레이블: {summary['top_labels']}")

    df = _history_dataframe(history)
    chart = (
        df.groupby("label")["confidence"].mean().reset_index().rename(columns={"confidence": "mean_confidence"})
    )
    st.bar_chart(chart.set_index("label"))


def _render_settings() -> None:
    st.title("설정 및 도구")
    st.write("Threshold 값을 초기화하거나 데모 결과를 생성할 수 있습니다.")

    if st.button("Threshold 초기화"):
        st.session_state.thresholds = DEFAULT_THRESHOLDS.copy()
        st.experimental_rerun()

    if st.button("임의 결과 생성"):
        history.add(fake_result())
        st.experimental_rerun()

    st.markdown("---")
    st.write("## 도움말")
    st.write(
        "업로드된 오디오는 세션 메모리에서만 처리되며, 모든 계산은 브라우저와 동일한 머신에서 수행됩니다."
    )


nav_choice = _render_sidebar()

if nav_choice == "대시보드":
    _render_dashboard()
elif nav_choice == "처리 현황":
    _render_processing()
elif nav_choice == "통계":
    _render_statistics()
else:
    _render_settings()
