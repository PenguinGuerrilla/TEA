"""Permutation feature importance for the exomoon-candidate PU models.

The base learner (HistGradientBoostingClassifier) has no native
`feature_importances_`, and we have no true negatives, so importance is measured
in a PU-appropriate way: how much does shuffling a feature degrade the model's
ability to separate known positives from the unlabeled pool?

    separation(scores) = mean(score | positive) - mean(score | unlabeled)
    importance(f)      = separation_base - mean_over_repeats(separation | f shuffled)

Each physical feature is permuted together with its `<feat>_missing` flag so one
number maps to one quantity. Direction = Spearman corr(feature value, score):
sign tells whether a *higher* value makes a planet more candidate-like.

Outputs -> ../public/predictions/<model>_importance.csv
"""
import csv
from pathlib import Path
import numpy as np
import pandas as pd

import build_features as bf
import train_pu as tp

SEED = tp.SEED
N_BAGS = 50          # lighter than the scoring run; importance is a ratio, stable
REPEATS = 10
OUT_DIR = bf.PUBLIC / "predictions"

# Pipeline-artifact features excluded from the importance analysis. `koi_score`
# is the Kepler Robovetter disposition score: it correlates with "is a confirmed
# planet" (most positives are confirmed), so it is label leakage rather than a
# physical driver. It stays in the prediction model but is not ranked here.
EXCLUDE = {"koi_score"}

# Features that are pipeline artifacts rather than physical planet/star
# properties (flagged in the output for honest interpretation). Anything in
# EXCLUDE is dropped before ranking, so this is currently empty.
NON_PHYSICAL = set()


def separation(scores, y):
    return float(scores[y == 1].mean() - scores[y == 0].mean())


def importance_for_model(name):
    d = bf.DATASETS[name]()
    X, meta, feats = d["X"], d["meta"], d["features"]
    y = meta["is_known_candidate"].values.astype(int)

    clfs, _ = tp.fit_bags(X, y, n_bags=N_BAGS, seed=SEED)
    base_scores = tp.ensemble_proba(clfs, X)
    base_sep = separation(base_scores, y)

    rng = np.random.default_rng(SEED)
    rows = []
    for f in feats:
        if f in EXCLUDE:
            continue
        cols = [f] + ([f + "_missing"] if (f + "_missing") in X.columns else [])
        drops = []
        for _ in range(REPEATS):
            Xp = X.copy()
            perm = rng.permutation(len(Xp))
            Xp[cols] = Xp[cols].values[perm]
            drops.append(base_sep - separation(tp.ensemble_proba(clfs, Xp), y))
        imp = float(np.mean(drops))
        # direction: Spearman corr of raw feature vs model score (monotone-safe
        # for the log-transformed columns). pandas handles NaN pairwise.
        direction = pd.Series(X[f].values).corr(pd.Series(base_scores), method="spearman")
        rows.append({
            "feature": f,
            "importance": imp,
            "importance_std": float(np.std(drops)),
            "direction": 0.0 if pd.isna(direction) else round(float(direction), 4),
            "non_physical": int(f in NON_PHYSICAL),
        })

    # normalize to % contribution (negative importances clamp to 0 for the share)
    pos_total = sum(max(0.0, r["importance"]) for r in rows) or 1.0
    for r in rows:
        r["importance_pct"] = round(100 * max(0.0, r["importance"]) / pos_total, 2)
        r["importance"] = round(r["importance"], 5)
        r["importance_std"] = round(r["importance_std"], 5)

    rows.sort(key=lambda r: r["importance"], reverse=True)
    for i, r in enumerate(rows, 1):
        r["rank"] = i
    return base_sep, rows


def write_csv(name, rows):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    fields = ["rank", "feature", "importance", "importance_std", "importance_pct",
              "direction", "non_physical"]
    with open(OUT_DIR / f"{name}_importance.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in rows:
            w.writerow({k: r[k] for k in fields})


if __name__ == "__main__":
    for name in ("kepler", "ps", "combined"):
        base_sep, rows = importance_for_model(name)
        print(f"\n=== {name} ===  base separation = {base_sep:.3f}")
        for r in rows:
            arrow = "↑" if r["direction"] > 0 else "↓" if r["direction"] < 0 else "·"
            tag = "  (non-physical)" if r["non_physical"] else ""
            print(f"  {r['rank']:2}. {r['feature']:16} {r['importance_pct']:5.1f}%  "
                  f"dir {arrow}{abs(r['direction']):.2f}{tag}")
        write_csv(name, rows)
    print(f"\nWrote importance artifacts to {OUT_DIR}")
