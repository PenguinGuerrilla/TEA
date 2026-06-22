# Exomoon-Candidate Prediction — ML Design Document

> **Living document.** Every change to the ML model (features, method,
> hyper-parameters, datasets, outputs, evaluation) MUST be reflected here in the
> same change. Update the relevant section and append a dated entry to
> [§12 Changelog](#12-changelog). If code and this doc disagree, the code is the
> bug until proven otherwise — but they should never diverge in a merged change.

- **Status:** active
- **Owner:** project maintainer
- **Code:** `ml/build_features.py`, `ml/train_pu.py`
- **Artifacts:** `public/predictions/{kepler,ps,combined}_predictions.csv` + `_metrics.json`
- **Consumer:** web app page `/predictions` (`src/Pages/Predictions/`)

---

## 1. Problem statement

Rank exoplanets in the NASA Exoplanet Archive (NEA) by how strongly they
resemble the planets that have already been **studied as exomoon hosts**, to
surface promising, not-yet-studied targets.

This is **not** a moon-detection model. We have no ground-truth "has a moon"
labels. We only know which planets astronomers *chose to investigate* for moons.
So the model learns the **profile of an exomoon search target** and ranks the
rest of the archive against it.

### 1.1 Why supervised / why this framing

- The curated candidate lists give ~150 positive examples — enough for a
  low-variance tabular model.
- We never observe true negatives (a planet absent from the lists may simply be
  unstudied), so the task is **Positive-Unlabeled (PU)**, not standard binary
  classification. This drives every method choice below.

---

## 2. Data

### 2.1 Sources (all already shipped in the repo)

| Role | File | Rows | Key |
|------|------|------|-----|
| Positives (Kepler) | `public/cumulative_no_duplicates.csv` | ~103 | `kepoi_name` |
| Positives (PS) | `public/PS_only_default_no_duplicates.csv` | ~51 | `pl_name` |
| Universe (Kepler) | `public/AllNEAData/cumulative_background.csv` | 9,564 | `kepoi_name` |
| Universe (PS) | `public/AllNEAData/ps_background.csv` | 6,298 | `pl_name` |

Positives are flagged by the presence of an `exomoon_reference` in the curated
files. **Verified:** every positive id is present in the corresponding
background file, so the background files are the complete scoring universe and
the positives are a labeled subset of them (no row is invented).

### 2.2 Label definition

```
y = 1  (Positive)   if the planet's id is in the curated exomoon-study list
y = 0  (Unlabeled)  otherwise   # NOT a confirmed negative
```

Prevalence ≈ 1% (≈150 / ≈15.7k). The unlabeled set is contaminated with
unknown positives — handled by the PU method, not by pretending y=0 means
"negative".

### 2.3 Measured feature availability (informs model choice)

- **Kepler features ~complete in positives**: `koi_model_snr`, `koi_depth`,
  `koi_duration`, `koi_period`, `koi_prad` all 0–3% missing.
- **PS features sparse**: `pl_bmasse` 57%, `pl_eqt` 67%, `pl_insol` 80% missing.

→ Kepler is the strongest, most physically meaningful space; PS/combined are
coarser fallbacks for broader (non-Kepler) coverage.

---

## 3. Three models

Trained **independently**, each scoring its own universe; the user selects one
in the UI.

| Model | Universe | Positives | Rationale |
|-------|----------|-----------|-----------|
| **`kepler`** (primary) | `cumulative_background.csv` | ~103 | Richest transit-detectability features; most known exomoon work is Kepler. |
| **`ps`** | `ps_background.csv` | ~51 | Planetary-Systems parameter space; covers non-Kepler planets; sparser. |
| **`combined`** | union of both (shared schema) | ~154 | Broadest reach using only columns common to both tables. |

The `combined` universe is built by mapping each source onto the shared physical
schema — the Python mirror of `src/utils/buildCombinedData.js`
(`build_features.combined_dataset`). **Keep the two mappings in sync.**

---

## 4. Features

### 4.1 Per-model feature lists (`ml/build_features.py`)

- **kepler:** `koi_period, koi_prad, koi_teq, koi_insol, koi_model_snr,
  koi_depth, koi_duration, koi_impact, koi_steff, koi_slogg, koi_srad,
  koi_kepmag, koi_score`
- **ps:** `pl_orbper, pl_orbsmax, pl_rade, pl_radj, pl_bmasse, pl_orbeccen,
  pl_insol, pl_eqt, st_teff, st_rad, st_mass, st_logg, sy_dist, sy_pnum,
  sy_snum, sy_vmag, sy_kmag, sy_gaiamag`
- **combined:** `pl_orbper, pl_rade, pl_eqt, pl_insol, st_teff, st_rad, st_logg`

### 4.2 Engineering rules (applied to every model)

1. **Drop leakage / non-physical columns:** all ids, names, reference/HTML
   strings, disposition text, and **`ra`/`dec`** (sky position has no causal
   link to moons and would let the model fit the Kepler field footprint).
2. **Combined only — drop `discoverymethod` / `disc_facility`:** Kepler rows are
   constant `Transit`/`Kepler`, so these encode the source table and let the
   model separate by provenance instead of physics.
3. **Missingness flags:** for each feature `c`, add binary `c_missing`. The fact
   a quantity was even measured is informative (esp. sparse PS columns).
4. **Log transform** (`log1p`, clipped ≥0) for right-skewed magnitudes:
   `koi_period, koi_insol, koi_depth, koi_duration, pl_orbper, pl_orbsmax,
   pl_insol, sy_dist`. Trees are scale-invariant, but this stabilizes the score
   distribution and any future linear PU estimator.
5. **No imputation needed:** the base learner (`HistGradientBoostingClassifier`)
   handles `NaN` natively. (The `c_missing` flags remain useful.)

---

## 5. Method — PU bagging

Implementation: `ml/train_pu.py::pu_bag_scores`. Algorithm
(Mordelet & Vert, *Bagging SVM to learn from positive and unlabeled examples*,
Pattern Recognition Letters 2014), base learner swapped for gradient-boosted
trees:

```
P = positives, U = unlabeled
for b in 1..N_BAGS (=100):
    Ub = random subsample of U, |Ub| = |P|, drawn WITHOUT replacement
    fit base classifier on  P(label 1) ∪ Ub(label 0)
    for rows OOB this bag (U \ Ub): accumulate predict_proba
    for P rows: accumulate predict_proba (always in-sample; flagged anyway)
score(row) = mean accumulated proba over bags that scored it      # ∈ [0,1]
```

- **Base learner:** `sklearn.ensemble.HistGradientBoostingClassifier`
  (`max_depth=3, max_iter=200, learning_rate=0.05, l2_regularization=1.0,
  random_state=42`).
- **Why bagging PU:** robust to unlabeled contamination, needs no guess of a
  negative set, each balanced bag (|Ub| = |P|) neutralizes the 1% imbalance, and
  OOB averaging yields a stable, calibrated-ish score.
- **Baseline (optional, for comparison):** a single class-weighted classifier
  treating all U as negative — biased, kept only as a sanity reference.

### 5.1 Output score semantics

`score ∈ [0,1]` = "exomoon **search-target** likeness." Higher = more like the
studied population (long period, large radius, high transit SNR, quiet/bright
star). Rows are written sorted by score descending; known positives are kept and
flagged (`is_known_candidate`), never hidden in the artifact.

---

## 6. Evaluation (PU-appropriate)

No accuracy/ROC-AUC against fabricated negatives. Implemented in
`train_pu.py::evaluate` — **stratified K-fold (K=5) over the positives only**:

For each fold, hold out 20% of positives, train PU bagging on the rest + all
unlabeled, then score `held-out positives ∪ unlabeled` and measure:

| Metric | Meaning | Want |
|--------|---------|------|
| `recall_at_top_decile` | fraction of held-out positives ranked in the top 10% | high (→1) |
| `median_positive_percentile` | median rank-percentile of held-out positives (1.0 = top) | high |
| `lee_liu` = recall² / Pr(score≥0.5) | Lee & Liu threshold-free PU criterion | higher = better |

Also reported for eyeballing: positive vs unlabeled **median score**, and the
top-10 *new* (non-known) picks.

### 6.1 Current results (seed 42, N_BAGS=100, K=5)

| Model | positives | recall@decile | median pctile | lee_liu | pos / unl median score |
|-------|-----------|---------------|---------------|---------|------------------------|
| kepler | 103 | 0.94 | 0.98 | 9.22 | 0.97 / 0.025 |
| ps | 51 | 0.72 | 0.96 | 2.80 | 0.91 / 0.27 |
| combined | 154 | 0.66 | 0.95 | 2.95 | 0.88 / 0.21 |

Sanity check passed: Kepler top *new* picks are classic multi-planet / HEK-style
targets (Kepler-11 g, Kepler-89 e, Kepler-411 d).

---

## 7. Feature importance (permutation)

Code: `ml/feature_importance.py`. The base learner has no native
`feature_importances_`, and we have no true negatives, so importance is measured
in a PU-appropriate way.

### 7.1 Metric
For the full ensemble (`n_bags=50`, `SEED`), importance of feature *f* = the drop
in **separation** when *f* is shuffled:

```
separation(s) = mean(s | positive) − mean(s | unlabeled)
importance(f) = separation_base − mean_over_repeats( separation | f shuffled )   # REPEATS=10
```

Each physical feature is permuted **together with its `<feat>_missing` flag**, so
one number maps to one quantity. Reported as raw `importance`, `importance_std`,
and a normalized `importance_pct` (negative importances clamp to 0 for the share).

### 7.2 Direction of effect
`direction` = Spearman corr(raw feature value, ensemble score) over all rows
(monotone-safe for the log-transformed columns). Sign = does a *higher* value
make a planet more candidate-like.

### 7.3 Current results (top drivers, seed 42)

| Model | Top features (%, direction) | Notes |
|-------|-----------------------------|-------|
| kepler | `koi_period` 56.2% ↑, `koi_teq` 12.9% ↓, `koi_model_snr` 11.0% ↑ | `koi_score` **excluded** (leakage, §7.4); orbital period dominates. |
| ps | `pl_rade` 30% ↑, `sy_pnum` 16.5% ↑, `sy_dist` 9.2% ↑ | multi-planet systems are studied more (selection bias). |
| combined | `pl_orbper` 29.5% ↑, `pl_rade` 28.3% ↑, `pl_insol` 13.1% ↓, `pl_eqt` 10.6% ↓ | longer period, larger, cooler, lower insolation → more candidate-like. |

Physically consistent with exomoon expectations: **wide orbits** (long period,
low insolation, cool equilibrium temperature) and **large planets** dominate —
moons are more dynamically stable and detectable around such hosts.

### 7.4 Excluded feature — `koi_score`
`koi_score` (Kepler Robovetter disposition) correlates with "is a confirmed
planet"; since most positives are confirmed, it is **label leakage**, not a
physical driver. It is listed in `feature_importance.EXCLUDE` and **dropped
before ranking**, so it does not appear in the importance artifacts. It still
remains a feature of the Kepler *prediction* model (held fixed during
permutation, i.e. a constant contributor) — only the importance analysis omits
it. Removing it from the model entirely is left as future work (§11).

## 8. Reproducibility

- Global `SEED = 42` (numpy RNG + base learner + K-fold). Deterministic given
  fixed inputs.
- CV uses reduced bags (`max(30, N_BAGS//2)`) for speed; the final scoring run
  uses the full `N_BAGS`.
- Pure CPU; full run ≈ 1–2 min on a laptop. No GPU, no network at train time.

---

## 9. Outputs / contract with the app

Per model, written to `public/predictions/`:

**`<model>_predictions.csv`** — sorted by `score` desc. Columns:
`id, name, is_known_candidate, <a few display features>, score`. Display feature
columns differ per model (see `build_features._bundle` meta construction):
- kepler: `koi_period, koi_prad, koi_teq, koi_model_snr`
- ps: `pl_orbper, pl_rade, pl_bmasse, pl_eqt`
- combined: `pl_orbper, pl_rade, pl_eqt`

**`<model>_metrics.json`** — `{model, n_positive, n_unlabeled, n_bags, seed,
cv_folds, recall_at_top_decile, recall_at_top_decile_std,
median_positive_percentile, lee_liu, positive_median_score,
unlabeled_median_score, features[]}`.

**`<model>_importance.csv`** (from `feature_importance.py`) — sorted by
importance desc. Columns: `rank, feature, importance, importance_std,
importance_pct, direction, non_physical`. Rendered as a Plotly horizontal bar
chart on `/predictions`: bar **length** = `importance_pct`, **side & color** =
`direction` (right/indigo = higher-value-more-candidate, left/amber = inverse);
`non_physical` starred.

The React page (`src/Pages/Predictions/`) loads these as static files (Papa +
`fetch`); **no inference runs in the browser.** The `/predictions` route is
lazy-loaded (Plotly is heavy) — see `src/App.jsx`. If the CSV column set changes,
update `src/Pages/Predictions/columns.jsx` (`FEATURE_COLUMNS`) and any new keys
in `src/Pages/Statistics/columnLabels.js`.

---

## 10. Known limitations & biases

- **Selection bias is the label.** The target is "looks like what people
  studied," which over-weights Kepler, long-period, large, high-SNR planets.
  High scores ≠ moons; communicated via the UI banner.
- **PU contamination.** Some unlabeled rows are genuine candidates; they
  correctly score high and may appear as "new predictions."
- **`combined` is weakest** (7 features, mixed populations). Use Kepler as the
  primary signal.
- **PS sparsity.** Heavy missingness; the model leans on missingness flags and a
  few well-populated columns.
- **No uncertainty quantification** beyond the bag spread (not currently
  exported).
- **Static artifacts.** Predictions are recomputed only when `train_pu.py` is
  re-run; they do not update with new NEA data automatically.

---

## 11. Possible future work

- Calibrate scores (isotonic / Platt against a PU-aware estimate of class prior).
- Estimate the class prior `Pr(y=1)` (Elkan–Noto / KM2) for a principled
  threshold instead of 0.5.
- Export per-row score variance (bag disagreement) as an uncertainty column.
- Physically-motivated derived features (planet bulk density, Hill-radius /
  moon-stability proxy, transit-duration-vs-period residual).
- Add XGBoost/LightGBM base option behind a flag and compare via `lee_liu`.
- Incremental refresh when NEA dumps update.
- **Drop `koi_score` from the Kepler prediction model** (it is already excluded
  from importance, §7.4) and re-check whether ranking quality holds without the
  leakage feature.

---

## 12. Changelog

| Date | Change | Sections touched |
|------|--------|------------------|
| 2026-06-22 | Initial design: 3 PU-bagging models (kepler/ps/combined) over `HistGradientBoostingClassifier`; PU K-fold eval; static CSV/JSON artifacts consumed by `/predictions`. | all |
| 2026-06-22 | Added permutation feature importance (`feature_importance.py`): PU-separation-drop metric + Spearman direction, per model; `<model>_importance.csv` artifacts; Plotly bar chart on `/predictions` (route made lazy). Refactored `train_pu.py` to share `fit_bags`/`ensemble_proba` (predictions unchanged). | §7, §9, §11, §12 |
| 2026-06-22 | Excluded `koi_score` from the importance analysis (`EXCLUDE` set) as label leakage; Kepler ranking now led by `koi_period` (56%), `koi_teq`, `koi_model_snr`. Still a model feature, only omitted from ranking. | §7.3, §7.4, §11 |
