# Exomoon-candidate prediction (PU learning)

Trains three independent models that rank NEA planets by how much they resemble
the planets already **studied as exomoon hosts**, and writes ranked CSVs that
the web app loads on the `/predictions` page.

## What the models actually predict

The labels are **positive-unlabeled (PU)**, not a clean binary:

- **Positives** = planets in the curated exomoon-study lists
  (`public/cumulative_no_duplicates.csv`, `public/PS_only_default_no_duplicates.csv`).
- **Unlabeled** = every other NEA planet (`public/AllNEAData/*_background.csv`).
  A non-candidate only means "not yet studied for moons" — **not** "has no moon".

So the score ranks **exomoon search-target likeness** (long orbital period, large
radius, high transit SNR, quiet/bright star), learned from which systems
astronomers chose to study. It is **not** a moon detection.

## Models

| Model | Universe | Positives | Notes |
|-------|----------|-----------|-------|
| `kepler` (primary) | `cumulative_background.csv` | ~103 KOIs | Richest, near-complete transit features (SNR, depth, duration). Best separation. |
| `ps` | `ps_background.csv` | ~51 | Planetary-Systems features; several are sparse (mass/eqt/insol). |
| `combined` | union of both | ~154 | Shared physical columns only. `discoverymethod`/`disc_facility` and `ra`/`dec` are dropped (source leakage / sky-footprint). |

## Method

PU **bagging** (Mordelet & Vert 2014): repeatedly sample an equal-size random
subset of the unlabeled rows as pseudo-negatives, fit a
`HistGradientBoostingClassifier` (handles NaN natively), and average each row's
out-of-bag scores over 100 bags → a [0,1] score.

Validation is PU-appropriate (no accuracy/AUC against fake negatives):
- Stratified K-fold **on the positives only**: hold out a slice of positives,
  train on the rest + unlabeled, measure how highly the held-out positives rank
  (`recall_at_top_decile`, `median_positive_percentile`).
- **Lee & Liu** criterion `recall² / Pr(predict positive)` — threshold-free.

## Run

```bash
cd ml
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python build_features.py     # sanity: row/positive counts per model
python train_pu.py           # prints CV metrics + top picks, writes prediction artifacts
python feature_importance.py # permutation importance + direction, writes *_importance.csv
```

Outputs (committed, consumed by the app):

```
public/predictions/{kepler,ps,combined}_predictions.csv   # id,name,is_known_candidate,<features>,score (sorted desc)
public/predictions/{kepler,ps,combined}_metrics.json      # CV metrics + score medians
```

Re-run whenever the candidate lists or background data change.

## Keep in sync

`build_features.py`'s combined-schema mapping mirrors
`src/utils/buildCombinedData.js`. Update both together.
