from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import sqlite3

# =====================================
# CONFIGURATION
# =====================================

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model_hybrid_final.pkl"
DATABASE = "database.db"

# load machine learning model
model = joblib.load(MODEL_PATH)

# urutan fitur yang digunakan model
FEATURE_ORDER = [
    "anxiety_level",
    "self_esteem",
    "mental_health_history",
    "depression",
    "headache",
    "blood_pressure",
    "sleep_quality",
    "breathing_problem",
    "noise_level",
    "living_conditions",
    "safety",
    "basic_needs",
    "academic_performance",
    "study_load",
    "teacher_student_relationship",
    "future_career_concerns",
    "social_support",
    "peer_pressure",
    "extracurricular_activities",
    "bullying"
]


# =====================================
# DATABASE CONNECTION
# =====================================

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# =====================================
# INITIALIZE DATABASE
# =====================================

def init_db():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        class_name TEXT,
        anxiety_level INTEGER,
        depression INTEGER,
        self_esteem INTEGER,
        stress_level INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


# =====================================
# PREDICT STRESS LEVEL
# =====================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.json

        # =====================================
        # PREPARE DATA FOR MODEL
        # =====================================

        features = {key: data[key] for key in FEATURE_ORDER}

        df = pd.DataFrame([features])
        df = df[FEATURE_ORDER]

        prediction = model.predict(df)[0]

        # =====================================
        # SAVE TO DATABASE
        # =====================================

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO students
        (name, class_name, anxiety_level, depression, self_esteem, stress_level)
        VALUES (?,?,?,?,?,?)
        """, (

            data["name"],
            data["className"],
            data["anxiety_level"],
            data["depression"],
            data["self_esteem"],
            int(prediction)

        ))

        conn.commit()
        conn.close()

        # siswa hanya menerima konfirmasi
        return jsonify({
            "status": "success",
            "message": "Data berhasil disimpan"
        })

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        })


# =====================================
# GET DATA FOR TEACHER DASHBOARD
# =====================================

@app.route("/data", methods=["GET"])
def get_data():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM students ORDER BY created_at DESC")

    rows = cursor.fetchall()

    result = []

    for row in rows:

        result.append({
            "id": row["id"],
            "name": row["name"],
            "className": row["class_name"],
            "anxiety_level": row["anxiety_level"],
            "depression": row["depression"],
            "self_esteem": row["self_esteem"],
            "stress_level": row["stress_level"],
            "created_at": row["created_at"]
        })

    conn.close()

    return jsonify(result)


# =====================================
# GET STATISTICS (FOR DASHBOARD)
# =====================================

@app.route("/stats", methods=["GET"])
def get_stats():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM students")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM students WHERE stress_level=0")
    low = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM students WHERE stress_level=1")
    moderate = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM students WHERE stress_level=2")
    high = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "total": total,
        "low": low,
        "moderate": moderate,
        "high": high
    })


# =====================================
# RUN SERVER
# =====================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)