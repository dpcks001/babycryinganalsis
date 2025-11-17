# Baby Crying Analysis (Python Edition)

This repository now contains a fully Python-based application for analyzing infant cry audio recordings. The previous Vite/React project was removed per the latest request and replaced with a single Streamlit experience backed by lightweight audio-analysis utilities written in pure Python.

## Project Overview

The new app offers:

- A Streamlit user interface that runs in any modern browser.
- Local audio processing using `librosa`, `numpy`, and `soundfile` with no external API calls.
- Configurable heuristics to guess potential reasons for a baby's cry (hunger, discomfort, pain, or self-soothing).
- Persistent analysis history during the session along with aggregate statistics.
- Downloadable CSV exports of the raw measurements used for each prediction.

The goal is to keep everything in Python while retaining the functionality of the original "Baby Crying Analysis" experience.

## Getting Started

1. Create and activate a Python 3.10+ virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the Streamlit application:
   ```bash
   streamlit run app.py
   ```
4. Open the provided local URL in your browser, upload a WAV/MP3 recording, adjust the detection thresholds, and review the generated insights.

### Preview without Streamlit

If you just want to see what the analysis experience feels like inside this repository (without installing Streamlit or other
scientific dependencies), run the lightweight preview CLI:

```bash
python preview.py --records 5 --seed 7
```

This command fabricates demo analyses with the same heuristics used by the app and prints a dashboard-style summary directly in the terminal.

## Project Structure

```text
.
├── app.py                     # Streamlit UI entry point
├── requirements.txt           # Python dependencies
└── babycryinganalsis
    ├── __init__.py
    ├── analyzer.py           # Audio feature extraction + heuristics
    ├── data_models.py        # Shared dataclasses and utilities
    └── demo.py               # Randomized demo data helpers
```

## Tests

To make sure the Python modules compile successfully, run:

```bash
python -m compileall babycryinganalsis
```

The Streamlit UI is best exercised manually because it relies on the browser runtime.
