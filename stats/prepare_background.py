#!/usr/bin/env python3
"""Slim the raw NEA exports in public/AllNEAData/ into background datasets
for the Statistics page.

- Strips the '#' comment header NEA puts on its exports.
- Keeps only the columns also present in the exomoon candidate CSVs
  (public/cumulative_no_duplicates.csv / PS_only_default_no_duplicates.csv),
  so any axis plottable for candidates is plottable for the background.
- Filters the PS export to default_flag == 1 (one row per planet).

Outputs:
  public/AllNEAData/cumulative_background.csv
  public/AllNEAData/ps_background.csv

Re-run after downloading fresh NEA exports (update the INPUT globs if the
filenames change).
"""

import csv
import glob
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
NEA_DIR = os.path.join(PUBLIC, "AllNEAData")


def find_input(pattern):
    matches = sorted(p for p in glob.glob(os.path.join(NEA_DIR, pattern))
                     if not p.endswith("_background.csv"))
    if not matches:
        sys.exit(f"No file matching {pattern} in {NEA_DIR}")
    return matches[-1]  # newest export


def candidate_columns(path):
    with open(path, newline="", encoding="utf-8") as f:
        return csv.DictReader(f).fieldnames


def read_nea(path):
    """NEA exports start with '# ...' comment lines; skip them."""
    with open(path, newline="", encoding="utf-8") as f:
        rows = csv.DictReader(line for line in f if not line.startswith("#"))
        yield from rows


def slim(input_path, candidate_csv, output_name, row_filter=None):
    columns = [c for c in candidate_columns(os.path.join(PUBLIC, candidate_csv))
               if c != "exomoon_reference"]
    out_path = os.path.join(NEA_DIR, output_name)
    kept = 0
    total = 0
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        for row in read_nea(input_path):
            total += 1
            if row_filter and not row_filter(row):
                continue
            writer.writerow({c: row.get(c, "") for c in columns})
            kept += 1
    size_mb = os.path.getsize(out_path) / 1e6
    print(f"{output_name}: {kept}/{total} rows, {len(columns)} cols, {size_mb:.1f} MB")


def main():
    slim(
        find_input("cumulative_*.csv"),
        "cumulative_no_duplicates.csv",
        "cumulative_background.csv",
    )
    slim(
        find_input("PS_*.csv"),
        "PS_only_default_no_duplicates.csv",
        "ps_background.csv",
        row_filter=lambda r: r.get("default_flag") == "1",
    )


if __name__ == "__main__":
    main()
