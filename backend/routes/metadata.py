"""
GET /api/metadata — returns all dropdown options for the Prediction Form.
Supports course & percentile query parameters to dynamically filter branches.
"""
from flask import Blueprint, jsonify, current_app, request
import pandas as pd

metadata_bp = Blueprint("metadata", __name__)

MAHARASHTRA_DISTRICTS = [
    "All", "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
    "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
    "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur",
    "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar",
    "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur",
    "Thane", "Wardha", "Washim", "Yavatmal",
]


@metadata_bp.route("/api/metadata", methods=["GET"])
def get_metadata():
    df_cutoffs      = current_app.df_cutoffs
    df_colleges     = current_app.df_colleges
    df_branches     = current_app.df_branches
    df_merged       = current_app.df_merged
    df_pharmacy     = current_app.df_pharmacy_master

    course_filter = request.args.get("course", "").strip()
    percentile_str = request.args.get("percentile", "").strip()

    try:
        # Courses
        eng_courses = df_cutoffs["course"].dropna().unique().tolist()
        pharm_courses = df_pharmacy["course"].dropna().unique().tolist() if not df_pharmacy.empty else []
        courses = sorted(list(set(eng_courses + pharm_courses)))

        # Academic Years
        eng_years = df_cutoffs["academic_year"].dropna().unique().tolist()
        pharm_years = df_pharmacy["academic_year"].dropna().unique().tolist() if not df_pharmacy.empty else []
        academic_years = sorted(list(set(eng_years + pharm_years)), reverse=True)

        # Categories
        eng_cats = df_cutoffs["category"].dropna().unique().tolist()
        pharm_cats = df_pharmacy["category"].dropna().unique().tolist() if not df_pharmacy.empty else []
        categories = sorted(list(set(eng_cats + pharm_cats)))

        cap_rounds = ["Round I", "Round II", "Round III", "Round IV"]


        # Universities
        eng_univs = df_colleges["university"].dropna().unique().tolist()
        pharm_univs = df_pharmacy["university"].dropna().unique().tolist() if not df_pharmacy.empty else []
        universities = sorted(list(set(eng_univs + pharm_univs)))

        # Filter branches dynamically by course
        if course_filter:
            target_df = current_app.get_dataset_for_course(course_filter)
            sub = target_df[target_df["course"].str.strip().str.lower() == course_filter.lower()]
            if not sub.empty:
                branches = sorted(sub["branch_name"].dropna().unique().tolist())
            elif course_filter.lower() == "pharmacy" and not df_pharmacy.empty:
                branches = sorted(df_pharmacy["branch_name"].dropna().unique().tolist())
            else:
                branches = sorted(df_branches["branch_name"].dropna().unique().tolist())
        else:
            all_b = df_branches["branch_name"].dropna().unique().tolist()
            if not df_pharmacy.empty:
                all_b += df_pharmacy["branch_name"].dropna().unique().tolist()
            branches = sorted(list(set(all_b)))

        # Filter branches by percentile score tier if provided
        if percentile_str and course_filter:
            try:
                pct = float(percentile_str)
                target_df = current_app.get_dataset_for_course(course_filter)
                sub_pct = target_df[
                    (target_df["course"].str.strip().str.lower() == course_filter.lower()) &
                    (target_df["cutoff_percentile"] <= pct + 10)
                ]
                if not sub_pct.empty:
                    branches = sorted(sub_pct["branch_name"].dropna().unique().tolist())
            except ValueError:
                pass


        return jsonify({
            "courses":        courses,
            "academic_years": academic_years,
            "categories":     categories,
            "cap_rounds":     cap_rounds,
            "universities":   universities,
            "districts":      MAHARASHTRA_DISTRICTS,
            "branches":       branches,
            "genders":        ["Male", "Female", "Other"],
        }), 200

    except Exception as e:
        current_app.logger.exception("Metadata error")
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500
