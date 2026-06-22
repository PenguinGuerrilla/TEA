"""Positive-Unlabeled training for exomoon-candidate ranking.

Method: PU bagging (Mordelet & Vert, 2014). The known exomoon-study candidates
are Positives (P); every other NEA row is Unlabeled (U) -- NOT a true negative.
We repeatedly draw a random subsample of U the same size as P, label it
"negative", and fit a gradient-boosted-tree base learner on P + that subsample.
Each row is scored by averaging predictions over the bags where it was
out-of-bag (OOB). The result is a [0,1] "exomoon-search-target likeness" score.

Validation is PU-appropriate (no accuracy/AUC against fake negatives):
  * Stratified K-fold on P only: hold out a slice of the positives, train on the
    rest + U, and measure how highly the held-out positives rank in the full
    score ordering (recall@top-decile, median percentile).
  * Lee & Liu criterion  recall^2 / Pr(predict positive)  -- threshold-free,
    needs no true negatives.

Outputs per model -> ../public/predictions/<model>_predictions.csv (+ _metrics.json).
"""
import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import StratifiedKFold

import build_features as bf

SEED = 42
N_BAGS = 100
CV_FOLDS = 5
TOP_FRAC = 0.10          # "top decile" for recall@K
THRESHOLD = 0.5          # decision threshold for the Lee-Liu criterion

OUT_DIR = bf.PUBLIC / "predictions"


def _base():
    # Handles NaN natively, fast, strong on tabular data -> no imputation needed.
    return HistGradientBoostingClassifier(
        max_depth=3, max_iter=200, learning_rate=0.05,
        l2_regularization=1.0, random_state=SEED,
    )


def pu_bag_scores(X, y, n_bags=N_BAGS, seed=SEED):
    """Average OOB scores over n_bags balanced P-vs-U-subsample fits.

    y: 1 = positive, 0 = unlabeled. Returns score array in [0,1] for every row.
    """
    rng = np.random.default_rng(seed)
    Xv = X.values
    pos_idx = np.where(y == 1)[0]
    unl_idx = np.where(y == 0)[0]
    n_pos = len(pos_idx)

    score_sum = np.zeros(len(y))
    score_cnt = np.zeros(len(y))

    for b in range(n_bags):
        samp = rng.choice(unl_idx, size=min(n_pos, len(unl_idx)), replace=False)
        train_idx = np.concatenate([pos_idx, samp])
        y_train = np.concatenate([np.ones(n_pos), np.zeros(len(samp))])
        clf = _base()
        clf.fit(Xv[train_idx], y_train)

        # OOB = unlabeled rows not used as pseudo-negatives this bag.
        in_bag = np.zeros(len(y), dtype=bool)
        in_bag[samp] = True
        oob = unl_idx[~in_bag[unl_idx]]
        if len(oob):
            score_sum[oob] += clf.predict_proba(Xv[oob])[:, 1]
            score_cnt[oob] += 1
        # Positives are always in training; score them in-sample (flagged anyway).
        score_sum[pos_idx] += clf.predict_proba(Xv[pos_idx])[:, 1]
        score_cnt[pos_idx] += 1

    score_cnt[score_cnt == 0] = 1
    return score_sum / score_cnt


def evaluate(X, y, seed=SEED):
    """K-fold over positives: rank held-out positives against all unlabeled."""
    pos_idx = np.where(y == 1)[0]
    unl_idx = np.where(y == 0)[0]
    skf = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=seed)
    recalls, percentiles, lee_lius = [], [], []

    for fold, (tr, te) in enumerate(skf.split(pos_idx, np.ones(len(pos_idx)))):
        test_pos = pos_idx[te]
        train_pos = pos_idx[tr]
        # training label vector: only train positives are positive
        y_fold = np.zeros(len(y))
        y_fold[train_pos] = 1
        scores = pu_bag_scores(X, y_fold, n_bags=max(30, N_BAGS // 2), seed=seed + fold)

        # Rank universe = held-out positives + all unlabeled (exclude train pos).
        eval_idx = np.concatenate([test_pos, unl_idx])
        order = np.argsort(-scores[eval_idx])
        ranked = eval_idx[order]
        pos_set = set(test_pos.tolist())
        ranks = np.array([i for i, idx in enumerate(ranked) if idx in pos_set])
        n_eval = len(eval_idx)

        top_k = int(np.ceil(TOP_FRAC * n_eval))
        recalls.append(float(np.mean(ranks < top_k)))
        percentiles.append(float(np.median(1 - ranks / n_eval)))  # 1.0 = top

        # Lee-Liu: recall^2 / Pr(score>=threshold) on this fold
        recall_t = float(np.mean(scores[test_pos] >= THRESHOLD))
        pr_pos = float(np.mean(scores[eval_idx] >= THRESHOLD)) or 1e-9
        lee_lius.append(recall_t ** 2 / pr_pos)

    return {
        "cv_folds": CV_FOLDS,
        "recall_at_top_decile": round(float(np.mean(recalls)), 4),
        "recall_at_top_decile_std": round(float(np.std(recalls)), 4),
        "median_positive_percentile": round(float(np.mean(percentiles)), 4),
        "lee_liu": round(float(np.mean(lee_lius)), 4),
    }


def run_model(name):
    d = bf.DATASETS[name]()
    meta, X = d["meta"], d["X"]
    y = meta["is_known_candidate"].values.astype(int)
    n_pos, n_unl = int(y.sum()), int((y == 0).sum())
    print(f"\n=== {name} ===  rows={len(y)}  positives={n_pos}  unlabeled={n_unl}")

    metrics = evaluate(X, y)
    print("  CV:", json.dumps(metrics))

    scores = pu_bag_scores(X, y)
    out = meta.copy()
    out["score"] = np.round(scores, 5)
    out = out.sort_values("score", ascending=False).reset_index(drop=True)

    pos_scores = scores[y == 1]
    unl_scores = scores[y == 0]
    print(f"  score: positives median={np.median(pos_scores):.3f} "
          f"unlabeled median={np.median(unl_scores):.3f}")
    print("  top 10 (excluding known candidates):")
    new = out[out["is_known_candidate"] == 0].head(10)
    for _, r in new.iterrows():
        print(f"    {r['score']:.3f}  {str(r['name'])[:24]:24} (id {r['id']})")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out.to_csv(OUT_DIR / f"{name}_predictions.csv", index=False)
    metrics.update({"model": name, "n_positive": n_pos, "n_unlabeled": n_unl,
                    "n_bags": N_BAGS, "seed": SEED,
                    "positive_median_score": round(float(np.median(pos_scores)), 4),
                    "unlabeled_median_score": round(float(np.median(unl_scores)), 4),
                    "features": d["features"]})
    with open(OUT_DIR / f"{name}_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)


if __name__ == "__main__":
    for m in ("kepler", "ps", "combined"):
        run_model(m)
    print(f"\nWrote artifacts to {OUT_DIR}")
