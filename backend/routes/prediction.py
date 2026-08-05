"""
POST /api/predict — returns predicted colleges for a student's profile.
"""
from flask import Blueprint, request, jsonify, current_app
from prediction.engine import predict_colleges

prediction_bp = Blueprint("prediction", __name__)


@prediction_bp.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # ── Required fields ──────────────────────────────────────────────────────
    required = ["course", "percentile", "category"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 422

    try:
        percentile = float(data["percentile"])
    except (TypeError, ValueError):
        return jsonify({"error": "percentile must be a number between 0 and 100"}), 422

    if not (0 <= percentile <= 100):
        return jsonify({"error": "percentile must be between 0 and 100"}), 422

    try:
        course_name = str(data["course"])
        df_target = current_app.get_dataset_for_course(course_name)

        result = predict_colleges(
            df_merged       = df_target,
            course          = course_name,
            percentile      = percentile,
            category        = str(data["category"]),
            cap_round       = str(data.get("cap_round") or "Round I"),
            academic_year   = data.get("academic_year"),
            preferred_branch= data.get("preferred_branch"),
            home_university = data.get("home_university"),
            district        = data.get("district"),
            gender          = data.get("gender"),
        )
        return jsonify(result), 200



    except Exception as e:
        current_app.logger.exception("Prediction error")
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500
