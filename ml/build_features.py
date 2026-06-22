"""Feature construction for the exomoon-candidate PU models.

Loads the NEA background CSVs (the full scoring universe the web app already
ships) and marks which rows are known exomoon-study candidates by id-joining
against the curated *_no_duplicates.csv files. Produces three independent
feature sets: kepler (primary), ps, and combined.

The `combined` mapping mirrors src/utils/buildCombinedData.js — keep the two in
sync. Only the shared *physical* columns are used; discoverymethod/disc_facility
are intentionally dropped (they encode the source table and would leak), as are
ra/dec (no physical link to moons; would fit the Kepler field footprint).
"""
from pathlib import Path
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
NEA = PUBLIC / "AllNEAData"

# --- candidate (positive) id sets -------------------------------------------

def _read_csv(path):
    return pd.read_csv(path, dtype=str, low_memory=False)

def kepler_positive_ids():
    df = _read_csv(PUBLIC / "cumulative_no_duplicates.csv")
    return set(df["kepoi_name"].dropna())

def ps_positive_ids():
    df = _read_csv(PUBLIC / "PS_only_default_no_duplicates.csv")
    return set(df["pl_name"].dropna())

# --- numeric coercion + light feature engineering ---------------------------

# Strongly right-skewed quantities: log1p stabilizes the trees' splits and the
# downstream score distribution. All are non-negative physical magnitudes.
LOG_FEATURES = {
    "koi_period", "koi_insol", "koi_depth", "koi_duration",
    "pl_orbper", "pl_orbsmax", "pl_insol", "sy_dist",
}

def _numeric(df, cols):
    out = pd.DataFrame(index=df.index)
    for c in cols:
        s = pd.to_numeric(df[c], errors="coerce") if c in df else pd.Series(np.nan, index=df.index)
        # missingness flag (informative, esp. for the sparse PS columns)
        out[f"{c}_missing"] = s.isna().astype(float)
        if c in LOG_FEATURES:
            s = np.log1p(s.clip(lower=0))
        out[c] = s
    return out

# --- per-model feature specs ------------------------------------------------

KEPLER_FEATURES = [
    "koi_period", "koi_prad", "koi_teq", "koi_insol", "koi_model_snr",
    "koi_depth", "koi_duration", "koi_impact", "koi_steff", "koi_slogg",
    "koi_srad", "koi_kepmag", "koi_score",
]
PS_FEATURES = [
    "pl_orbper", "pl_orbsmax", "pl_rade", "pl_radj", "pl_bmasse", "pl_orbeccen",
    "pl_insol", "pl_eqt", "st_teff", "st_rad", "st_mass", "st_logg",
    "sy_dist", "sy_pnum", "sy_snum", "sy_vmag", "sy_kmag", "sy_gaiamag",
]
COMBINED_FEATURES = [
    "pl_orbper", "pl_rade", "pl_eqt", "pl_insol", "st_teff", "st_rad", "st_logg",
]

def _bundle(meta, X, features):
    """meta: DataFrame[id,name,is_known_candidate,<display cols>]; X: numeric."""
    return {"meta": meta.reset_index(drop=True), "X": X.reset_index(drop=True),
            "features": features}

def kepler_dataset():
    df = _read_csv(NEA / "cumulative_background.csv")
    pos = kepler_positive_ids()
    meta = pd.DataFrame({
        "id": df["kepoi_name"],
        "name": df["kepler_name"].fillna("").where(df["kepler_name"].notna() & (df["kepler_name"] != ""), df["kepoi_name"]),
        "is_known_candidate": df["kepoi_name"].isin(pos).astype(int),
        "koi_period": pd.to_numeric(df["koi_period"], errors="coerce"),
        "koi_prad": pd.to_numeric(df["koi_prad"], errors="coerce"),
        "koi_teq": pd.to_numeric(df["koi_teq"], errors="coerce"),
        "koi_model_snr": pd.to_numeric(df["koi_model_snr"], errors="coerce"),
    })
    return _bundle(meta, _numeric(df, KEPLER_FEATURES), KEPLER_FEATURES)

def ps_dataset():
    df = _read_csv(NEA / "ps_background.csv")
    pos = ps_positive_ids()
    meta = pd.DataFrame({
        "id": df["pl_name"],
        "name": df["pl_name"],
        "is_known_candidate": df["pl_name"].isin(pos).astype(int),
        "pl_orbper": pd.to_numeric(df["pl_orbper"], errors="coerce"),
        "pl_rade": pd.to_numeric(df["pl_rade"], errors="coerce"),
        "pl_bmasse": pd.to_numeric(df["pl_bmasse"], errors="coerce"),
        "pl_eqt": pd.to_numeric(df["pl_eqt"], errors="coerce"),
    })
    return _bundle(meta, _numeric(df, PS_FEATURES), PS_FEATURES)

def combined_dataset():
    """Union of both backgrounds on the shared physical schema (mirrors
    buildCombinedData.js). Kepler rows are tagged via koi_* -> pl_* mapping."""
    cum = _read_csv(NEA / "cumulative_background.csv")
    ps = _read_csv(NEA / "ps_background.csv")
    kpos, ppos = kepler_positive_ids(), ps_positive_ids()

    cmap = {"pl_orbper": "koi_period", "pl_rade": "koi_prad", "pl_eqt": "koi_teq",
            "pl_insol": "koi_insol", "st_teff": "koi_steff", "st_rad": "koi_srad",
            "st_logg": "koi_slogg"}
    cum_df = pd.DataFrame({c: cum[src] for c, src in cmap.items()})
    cum_df["id"] = cum["kepoi_name"]
    cum_df["name"] = cum["kepler_name"].where(cum["kepler_name"].notna() & (cum["kepler_name"] != ""), cum["kepoi_name"])
    cum_df["is_known_candidate"] = cum["kepoi_name"].isin(kpos).astype(int)

    ps_df = pd.DataFrame({c: ps[c] for c in COMBINED_FEATURES})
    ps_df["id"] = ps["pl_name"]
    ps_df["name"] = ps["pl_name"]
    ps_df["is_known_candidate"] = ps["pl_name"].isin(ppos).astype(int)

    both = pd.concat([cum_df, ps_df], ignore_index=True)
    meta = both[["id", "name", "is_known_candidate", "pl_orbper", "pl_rade", "pl_eqt"]].copy()
    meta["pl_orbper"] = pd.to_numeric(meta["pl_orbper"], errors="coerce")
    meta["pl_rade"] = pd.to_numeric(meta["pl_rade"], errors="coerce")
    meta["pl_eqt"] = pd.to_numeric(meta["pl_eqt"], errors="coerce")
    return _bundle(meta, _numeric(both, COMBINED_FEATURES), COMBINED_FEATURES)

DATASETS = {
    "kepler": kepler_dataset,
    "ps": ps_dataset,
    "combined": combined_dataset,
}

if __name__ == "__main__":
    for name, fn in DATASETS.items():
        d = fn()
        n = len(d["meta"])
        p = int(d["meta"]["is_known_candidate"].sum())
        print(f"{name:9} rows={n:6} positives={p:4} features={len(d['features'])}")
