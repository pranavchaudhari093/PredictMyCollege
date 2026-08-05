"""
Prediction Engine — High-Precision Algorithm for MHT-CET College Prediction.
Supports single or multi-branch preferences, candidate category mapping,
and multi-round cutoff analysis.
"""
import pandas as pd
import numpy as np

SAFE_MARGIN   = 0.5   # Student percentile >= Cutoff + 0.5 (Safe)
TARGET_MARGIN = -1.5  # Cutoff - 1.5 <= Student percentile < Cutoff + 0.5 (Target)

CATEGORY_QUOTA_MAP = {
    "OPEN":     (["MS", "Maharashtra_State", "MH_State", "GOPENH", "GOPENO", "LOPENH", "LOPENO", "All_India"], "MHT-CET"),
    "OBC":      (["MS", "Maharashtra_State", "MH_State", "GOBC", "LOBC", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "SC":       (["MS", "Maharashtra_State", "MH_State", "GSC", "LSC", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "ST":       (["MS", "Maharashtra_State", "MH_State", "GST", "LST", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "VJ":       (["MS", "Maharashtra_State", "MH_State", "GVJ", "LVJ", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "VJ/DT":    (["MS", "Maharashtra_State", "MH_State", "GVJ", "LVJ", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "NT1":      (["MS", "Maharashtra_State", "MH_State", "GNT1", "LNT1", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "NT-B":     (["MS", "Maharashtra_State", "MH_State", "GNT1", "LNT1", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "NT2":      (["MS", "Maharashtra_State", "MH_State", "GNT2", "LNT2", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "NT-C":     (["MS", "Maharashtra_State", "MH_State", "GNT2", "LNT2", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "NT3":      (["MS", "Maharashtra_State", "MH_State", "GNT3", "LNT3", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "NT-D":     (["MS", "Maharashtra_State", "MH_State", "GNT3", "LNT3", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "SEBC":     (["MS", "Maharashtra_State", "MH_State", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "ORPHAN":   (["MS", "Maharashtra_State", "MH_State", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "MI":       (["MS", "Maharashtra_State", "MH_State", "MI", "All_India"], "MHT-CET"),
    "EWS":      (["MS", "Maharashtra_State", "MH_State", "EWS", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "TFWS":     (["MS", "Maharashtra_State", "MH_State", "TFWS", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "PWD":      (["MS", "Maharashtra_State", "MH_State", "PWD", "GOPENH", "GOPENO", "All_India"], "MHT-CET"),
    "AI":       (["AI", "All_India"], "JEE(Main)"),
    "OPEN(AI)": (["AI", "All_India"], "JEE(Main)"),
}



def compute_admission_chance(student_pct: float, cutoff_pct: float) -> str:
    if pd.isna(cutoff_pct) or cutoff_pct is None:
        return "unknown"
    diff = student_pct - cutoff_pct
    if diff >= SAFE_MARGIN:
        return "safe"
    elif diff >= TARGET_MARGIN:
        return "target"
    else:
        return "dream"


def predict_colleges(
    df_merged: pd.DataFrame,
    course: str,
    percentile: float,
    category: str,
    cap_round: str,
    academic_year: str | None = None,
    preferred_branch: str | list | None = None,
    home_university: str | None = None,
    district: str | None = None,
    gender: str | None = None,
    candidate_type: str | None = None,
) -> dict:
    df = df_merged.copy()

    # 1. Filter Course
    if course:
        df = df[df["course"].str.strip().str.lower() == course.strip().lower()]

    # 2. Filter Academic Year
    years = sorted(df["academic_year"].dropna().unique().tolist())
    target_year = academic_year if (academic_year and academic_year in years) else (years[-1] if years else None)
    if target_year:
        df = df[df["academic_year"] == target_year]

    # 3. Filter Category & Quota
    cat_upper = category.upper().strip()
    cat_aliases = {
        "NT1": ["NT1", "NT-B"],
        "NT-B": ["NT1", "NT-B"],
        "NT2": ["NT2", "NT-C"],
        "NT-C": ["NT2", "NT-C"],
        "NT3": ["NT3", "NT-D"],
        "NT-D": ["NT3", "NT-D"],
        "VJ": ["VJ", "VJ/DT"],
        "VJ/DT": ["VJ", "VJ/DT"],
    }
    matching_cats = [c.upper() for c in cat_aliases.get(cat_upper, [cat_upper])]
    quota_list, _ = CATEGORY_QUOTA_MAP.get(cat_upper, (["MS", "Maharashtra_State", "MH_State", "All_India"], "MHT-CET"))

    df_cat = df[
        (df["category"].str.upper().str.strip().isin(matching_cats)) |
        (df["seat_quota_type"].str.strip().isin(quota_list))
    ]
    if df_cat.empty:
        df_cat = df[df["category"].str.upper().str.strip() == "OPEN"]
    df = df_cat

    # Build Multi-Round Cutoff Lookup across ALL 3 CAP Rounds for this category & course
    all_rounds_df = df_merged.copy()
    if course:
        all_rounds_df = all_rounds_df[all_rounds_df["course"].str.strip().str.lower() == course.strip().lower()]
    if target_year:
        all_rounds_df = all_rounds_df[all_rounds_df["academic_year"] == target_year]
    all_rounds_df = all_rounds_df[
        (all_rounds_df["category"].str.upper().str.strip().isin(matching_cats)) |
        (all_rounds_df["seat_quota_type"].str.strip().isin(quota_list))
    ]


    round_lookup = {}
    for (inst, branch), grp in all_rounds_df.groupby(["institute_code", "branch_name"]):
        r1_row = grp[grp["cap_round"].str.strip().isin(["Round I", "Round 1", "1"])]
        r2_row = grp[grp["cap_round"].str.strip().isin(["Round II", "Round 2", "2"])]
        r3_row = grp[grp["cap_round"].str.strip().isin(["Round III", "Round 3", "3"])]
        r4_row = grp[grp["cap_round"].str.strip().isin(["Round IV", "Round 4", "4"])]

        r1_val = float(r1_row.iloc[0]["cutoff_percentile"]) if not r1_row.empty and not pd.isna(r1_row.iloc[0]["cutoff_percentile"]) else None
        r2_val = float(r2_row.iloc[0]["cutoff_percentile"]) if not r2_row.empty and not pd.isna(r2_row.iloc[0]["cutoff_percentile"]) else None
        r3_val = float(r3_row.iloc[0]["cutoff_percentile"]) if not r3_row.empty and not pd.isna(r3_row.iloc[0]["cutoff_percentile"]) else None
        r4_val = float(r4_row.iloc[0]["cutoff_percentile"]) if not r4_row.empty and not pd.isna(r4_row.iloc[0]["cutoff_percentile"]) else None

        round_lookup[(int(inst), str(branch).strip())] = {
            "r1": r1_val,
            "r2": r2_val,
            "r3": r3_val,
            "r4": r4_val,
        }

    # 4. Optional Branch Filter (support single string or list of branches)
    if preferred_branch:
        if isinstance(preferred_branch, str):
            preferred_branch = [preferred_branch]
        if isinstance(preferred_branch, list) and len(preferred_branch) > 0:
            branches_lower = [b.lower().strip() for b in preferred_branch if b.lower().strip() not in ("all", "any", "")]
            if branches_lower:
                def branch_match(branch_val):
                    val_str = str(branch_val).lower().strip()
                    for b in branches_lower:
                        if b in ("pharmacy", "b. pharmacy", "b.pharm", "b. pharmacy (b.pharm)"):
                            if val_str in ("pharmacy", "b. pharmacy", "b.pharm") or (val_str.startswith("pharmacy") and "pharm d" not in val_str):
                                return True
                        elif b in ("pharm d", "d. pharmacy", "d.pharm", "pharm d ( doctor of pharmacy)"):
                            if "pharm d" in val_str or "d.pharm" in val_str:
                                return True
                        elif b in val_str:
                            return True
                    return False

                df_b = df[df["branch_name"].apply(branch_match)]
                if not df_b.empty:
                    df = df_b


    # 5. Optional University / District Filter
    if home_university and home_university.lower() not in ("all", "any", ""):
        df_u = df[df["university"].str.lower().str.contains(home_university.strip().lower(), na=False)]
        if not df_u.empty:
            df = df_u

    if district and district.lower() not in ("all", "any", ""):
        df_d = df[df["institute_name"].str.lower().str.contains(district.strip().lower(), na=False)]
        if not df_d.empty:
            df = df_d

    # 6. Compute overall admission chance
    df = df.copy()
    df["admission_chance"] = df["cutoff_percentile"].apply(lambda c: compute_admission_chance(percentile, c))

    chance_order = {"safe": 0, "target": 1, "dream": 2, "unknown": 3}
    df["chance_rank"] = df["admission_chance"].map(chance_order)
    df = df.sort_values(["chance_rank", "cutoff_percentile"], ascending=[True, False])

    # 7. Deduplicate & Compile Results
    seen = set()
    results = []

    for _, row in df.iterrows():
        inst_id = int(row["institute_code"])
        branch_str = str(row.get("branch_name", "")).strip() or "General Engineering"
        key = (inst_id, branch_str)
        if key in seen:
            continue
        seen.add(key)

        rounds = round_lookup.get(key, {})
        r1_val = rounds.get("r1")
        r2_val = rounds.get("r2")
        r3_val = rounds.get("r3")
        r4_val = rounds.get("r4")

        row_cutoff = float(row.get("cutoff_percentile")) if not pd.isna(row.get("cutoff_percentile")) else None
        if r1_val is None and row_cutoff is not None:
            r1_val = row_cutoff

        # Calculate chance per round
        r1_chance = compute_admission_chance(percentile, r1_val)
        r2_chance = compute_admission_chance(percentile, r2_val)
        r3_chance = compute_admission_chance(percentile, r3_val)
        r4_chance = compute_admission_chance(percentile, r4_val)

        results.append({
            "institute_code":     inst_id,
            "college_name":       str(row.get("institute_name", "")).strip() or "Unknown College",
            "branch":             branch_str,
            "location":           str(row.get("university", "")).strip() or "Maharashtra",
            "status_type":        str(row.get("status_type", "")).strip() or "Approved",
            "cap_round_1_cutoff": _fmt(r1_val),
            "cap_round_1_chance": r1_chance,
            "cap_round_2_cutoff": _fmt(r2_val),
            "cap_round_2_chance": r2_chance,
            "cap_round_3_cutoff": _fmt(r3_val),
            "cap_round_3_chance": r3_chance,
            "cap_round_4_cutoff": _fmt(r4_val),
            "cap_round_4_chance": r4_chance,
            "cutoff_percentile":  _fmt(row_cutoff),
            "admission_chance":   compute_admission_chance(percentile, row_cutoff or r1_val),
        })


    result_df = pd.DataFrame(results) if results else pd.DataFrame()
    filters_meta = {
        "districts": sorted(result_df["location"].dropna().unique().tolist()) if not result_df.empty else [],
        "college_types": sorted(result_df["status_type"].dropna().unique().tolist()) if not result_df.empty else [],
        "branches": sorted(result_df["branch"].dropna().unique().tolist()) if not result_df.empty else [],
    }

    return {
        "total": len(results),
        "colleges": results,
        "filters_meta": filters_meta,
    }


def _fmt(val):
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return None
    return round(float(val), 4)
