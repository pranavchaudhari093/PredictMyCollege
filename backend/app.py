"""
PredictMyCollege Backend — Flask Web Server & API
Serves both the backend REST API endpoints and static Vanilla HTML/CSS/JS frontend pages.
"""
import os
import pandas as pd
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# ─── Pre-load DataFrames at startup ──────────────────────────────────────────
DATA_PATH = os.getenv("CSV_DATA_PATH", "../data")

print("[*] Loading CSV data files...")

# 1. Engineering / MCA Data
df_cutoffs     = pd.read_csv(os.path.join(DATA_PATH, "cap_cutoffs.csv"))
df_colleges    = pd.read_csv(os.path.join(DATA_PATH, "colleges.csv"))
df_branches    = pd.read_csv(os.path.join(DATA_PATH, "branches.csv"))
df_seat_matrix = pd.read_csv(os.path.join(DATA_PATH, "seat_matrix.csv"))

# Normalize string columns
str_cols_cutoffs = ["course", "cap_round", "document_type", "seat_quota_type", "category", "exam_type"]
for col in str_cols_cutoffs:
    if col in df_cutoffs.columns:
        df_cutoffs[col] = df_cutoffs[col].astype(str).str.strip()

df_colleges["institute_name"] = df_colleges["institute_name"].astype(str).str.strip()
df_colleges["status_type"]    = df_colleges["status_type"].astype(str).str.strip()
df_branches["branch_name"]    = df_branches["branch_name"].astype(str).str.strip()

# Build merged lookup: cutoffs + college name + branch name
df_merged = df_cutoffs.merge(
    df_colleges[["institute_code", "institute_name", "university", "status_type"]],
    on="institute_code",
    how="left"
).merge(
    df_branches[["choice_code", "branch_name"]],
    on="choice_code",
    how="left"
)

# 2. Pharmacy Data
pharmacy_master_path = os.path.join(DATA_PATH, "pharmacy_master_database.csv")
pharmacy_cutoffs_path = os.path.join(DATA_PATH, "pharmacy_cutoffs.csv")
pharmacy_branches_path = os.path.join(DATA_PATH, "pharmacy_branches.csv")

if os.path.exists(pharmacy_master_path):
    df_pharmacy_master = pd.read_csv(pharmacy_master_path)
else:
    df_pharmacy_master = pd.DataFrame()

if os.path.exists(pharmacy_cutoffs_path):
    df_pharmacy_cutoffs = pd.read_csv(pharmacy_cutoffs_path)
else:
    df_pharmacy_cutoffs = pd.DataFrame()

if os.path.exists(pharmacy_branches_path):
    df_pharmacy_branches = pd.read_csv(pharmacy_branches_path)
else:
    df_pharmacy_branches = pd.DataFrame()

# Normalize Pharmacy columns
for df_p in [df_pharmacy_master, df_pharmacy_cutoffs, df_pharmacy_branches]:
    if not df_p.empty:
        for col in df_p.select_dtypes(include="object").columns:
            df_p[col] = df_p[col].astype(str).str.strip()

print(f"[OK] Engineering/MCA Data loaded - {len(df_merged):,} cutoff records ready.")
print(f"[OK] Pharmacy Data loaded - {len(df_pharmacy_master):,} records ready.")

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

# ─── App Factory ─────────────────────────────────────────────────────────────
def create_app():
    app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")

    CORS(app)

    # Attach DataFrames to app for use in routes
    app.df_merged           = df_merged
    app.df_colleges         = df_colleges
    app.df_branches         = df_branches
    app.df_cutoffs          = df_cutoffs
    app.df_pharmacy_master  = df_pharmacy_master
    app.df_pharmacy_cutoffs = df_pharmacy_cutoffs
    app.df_pharmacy_branches= df_pharmacy_branches

    def get_dataset_for_course(course_name: str | None):
        if course_name and str(course_name).strip().lower() == "pharmacy":
            return app.df_pharmacy_master
        return app.df_merged

    app.get_dataset_for_course = get_dataset_for_course


    from routes.prediction import prediction_bp
    from routes.metadata   import metadata_bp
    app.register_blueprint(prediction_bp)
    app.register_blueprint(metadata_bp)

    @app.route("/api/health")
    def health():
        return {"status": "ok", "records": len(df_merged)}

    # Frontend Page Routes (All 5 Stitch Screens)
    @app.route("/")
    def serve_home():
        return send_from_directory(FRONTEND_DIR, "index.html")

    @app.route("/predict")
    @app.route("/predict.html")
    def serve_predict():
        return send_from_directory(FRONTEND_DIR, "predict.html")

    @app.route("/results")
    @app.route("/results.html")
    def serve_results():
        return send_from_directory(FRONTEND_DIR, "results.html")

    @app.route("/dashboard")
    @app.route("/dashboard.html")
    def serve_dashboard():
        return send_from_directory(FRONTEND_DIR, "dashboard.html")

    @app.route("/settings")
    @app.route("/settings.html")
    def serve_settings():
        return send_from_directory(FRONTEND_DIR, "settings.html")

    # Serve static assets (JS, CSS, Images)
    @app.route("/<path:path>")
    def serve_static(path):
        if os.path.exists(os.path.join(FRONTEND_DIR, path)):
            return send_from_directory(FRONTEND_DIR, path)
        return send_from_directory(FRONTEND_DIR, "index.html")

    return app


if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    app  = create_app()
    print(f"[*] Server starting on http://localhost:{port}")
    app.run(debug=True, port=port, host="0.0.0.0")
