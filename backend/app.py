from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import joblib
import sqlite3
import os
import sys
import __main__

# =========================================================
# 1. KONFIGURASI PATH & SISMAL WEB
# =========================================================
base_dir = os.path.dirname(os.path.abspath(__file__))
# Struktur folder: /project/backend/app.py dan /project/frontend/
frontend_dir = os.path.join(base_dir, "..", "frontend")

app = Flask(__name__, 
            template_folder=frontend_dir, 
            static_folder=frontend_dir,   
            static_url_path='')           

CORS(app)

MODEL_PATH = os.path.join(base_dir, "model_stress_final.pkl")
DATABASE = os.path.join(base_dir, "database.db")

# =========================================================
# 2. ML MODEL LOGIC (SINKRONISASI 100% DENGAN NOTEBOOK STRESS9)
# =========================================================

def binning_logic(X_subset):
    """
    Fungsi binning custom yang wajib didefinisikan sebelum load model .pkl.
    Mengembalikan NumPy Array 2D agar sinkron dengan output StandardScaler.
    """
    X_subset = pd.DataFrame(X_subset).copy()
    X_subset.iloc[:, 0] = pd.cut(X_subset.iloc[:, 0], bins=[-1, 4, 9, 14, 100], labels=False)
    X_subset.iloc[:, 1] = pd.cut(X_subset.iloc[:, 1], bins=[-1, 14, 25, 100], labels=False)
    X_subset.iloc[:, 2] = pd.cut(X_subset.iloc[:, 2], bins=[-1, 4, 9, 14, 19, 100], labels=False)
    return X_subset.to_numpy()

# Daftarkan fungsi ke modul utama runtime secara eksplisit sebelum load
__main__.binning_logic = binning_logic
sys.modules['__main__'].binning_logic = binning_logic

# Inisialisasi awal variabel model dengan None untuk mencegah NameError mendadak
model = None

# Memuat Pipeline Model Hibrida (.pkl)
try:
    if os.path.exists(MODEL_PATH):
        # 1. Load model mentah dari file pkl
        model = joblib.load(MODEL_PATH)
        
        # 2. 🛠️ DI SINI LETAK PATCH CODE OTOMATISNYA
        # Menyuntikkan 'monotonic_cst' secara otomatis ke sub-model pohon agar tidak error di scikit-learn >= 1.4
        def patch_estimator(est):
            if est is None:
                return
            if not hasattr(est, 'monotonic_cst') and est.__class__.__name__ in ['DecisionTreeClassifier', 'DecisionTreeRegressor']:
                est.monotonic_cst = None
            if hasattr(est, 'estimators_'):
                try:
                    for sub_est in est.estimators_:
                        patch_estimator(sub_est)
                except:
                    pass
            if hasattr(est, 'named_estimators_'):
                for sub_est in est.named_estimators_.values():
                    patch_estimator(sub_est)
            if hasattr(est, 'final_estimator_'):
                patch_estimator(est.final_estimator_)

        if model is not None:
            if hasattr(model, 'steps'):
                for name, step in model.steps:
                    patch_estimator(step)
            else:
                patch_estimator(model)
                
        print("✅ Model ML 'model_stress_final.pkl' Berhasil Dimuat & Di-patch!")
    else:
        print("\n❌ CRITICAL ERROR: File model_stress_final.pkl TIDAK DITEMUKAN!")
        print(f"👉 Solusi: Silakan pindahkan file 'model_stress_final.pkl' Anda ke dalam folder: {base_dir}\n")
except Exception as e:
    print(f"❌ Gagal memuat model ML. Error: {e}")

# =========================================================
# 3. DATABASE MANAGEMENT (SQLite3 - SKEMA DIPERLUAS)
# =========================================================
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    Membuat tabel dengan skema lengkap untuk menyimpan 20 fitur kuesioner + 
    2 fitur rekayasa untuk keperluan analisis mendalam oleh Guru BK.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            className TEXT NOT NULL,
            anxiety_level INTEGER, self_esteem INTEGER, mental_health_history INTEGER,
            depression INTEGER, headache INTEGER, blood_pressure INTEGER,
            sleep_quality INTEGER, breathing_problem INTEGER, noise_level INTEGER,
            living_conditions INTEGER, safety INTEGER, basic_needs INTEGER,
            academic_performance INTEGER, study_load INTEGER, teacher_student_relationship INTEGER,
            future_career_concerns INTEGER, social_support INTEGER, peer_pressure INTEGER,
            extracurricular_activities INTEGER, bullying INTEGER,
            mental_score INTEGER, academic_strain REAL,
            stress_level INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Database SQLite3 Berhasil Dikonfigurasi dengan Skema Lengkap!")

# Jalankan skema database saat aplikasi Flask pertama kali dinyalakan
with app.app_context():
    init_db()

# =========================================================
# 4. API ROUTING / ENDPOINTS
# =========================================================

@app.route("/")
def index():
    """Merender halaman utama antarmuka SPA"""
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({
            "status": "error", 
            "message": f"Sistem Backend Gagal Mendeteksi Model ML. Pastikan file 'model_stress_final.pkl' sudah dimasukkan ke folder backend di alamat absolut: {base_dir}"
        }), 500

    try:
        data = request.json
        if not data:
            return jsonify({"status": "error", "message": "Payload JSON kosong atau tidak valid"}), 400
        
        # 1. Menangkap 20 Fitur Utama secara presisi dari form Frontend
        input_features = {
            'anxiety_level': [float(data.get('anxiety_level', 0))],
            'self_esteem': [float(data.get('self_esteem', 0))],
            'mental_health_history': [float(data.get('mental_health_history', 0))],
            'depression': [float(data.get('depression', 0))],
            'headache': [float(data.get('headache', 0))],
            'blood_pressure': [float(data.get('blood_pressure', 0))],
            'sleep_quality': [float(data.get('sleep_quality', 0))],
            'breathing_problem': [float(data.get('breathing_problem', 0))],
            'noise_level': [float(data.get('noise_level', 0))],
            'living_conditions': [float(data.get('living_conditions', 0))],
            'safety': [float(data.get('safety', 0))],
            'basic_needs': [float(data.get('basic_needs', 0))],
            'academic_performance': [float(data.get('academic_performance', 0))],
            'study_load': [float(data.get('study_load', 0))],
            'teacher_student_relationship': [float(data.get('teacher_student_relationship', 0))],
            'future_career_concerns': [float(data.get('future_career_concerns', 0))],
            'social_support': [float(data.get('social_support', 0))],
            'peer_pressure': [float(data.get('peer_pressure', 0))],
            'extracurricular_activities': [float(data.get('extracurricular_activities', 0))],
            'bullying': [float(data.get('bullying', 0))]
        }
        
        # 2. AUTO-FEATURE ENGINEERING (Penyelarasan Struktur Data Latih)
        perf = input_features['academic_performance'][0]
        if perf == 0: 
            perf = 1e-5  # Proteksi matematis agar tidak terjadi division by zero
            
        calc_mental_score = input_features['anxiety_level'][0] + input_features['depression'][0]
        calc_academic_strain = (input_features['study_load'][0] + input_features['future_career_concerns'][0]) / perf
        
        input_features['mental_score'] = [calc_mental_score]
        input_features['academic_strain'] = [calc_academic_strain]
        
        # Konversi dictionary ke Pandas DataFrame
        df_input = pd.DataFrame(input_features)
        
        # AMANKAN URUTAN FITUR: Susun kolom sesuai urutan fit() pada ColumnTransformer asli Anda
        kolom_sesuai = [
            'anxiety_level', 'self_esteem', 'depression',
            'mental_health_history', 'headache', 'blood_pressure', 'sleep_quality',
            'breathing_problem', 'noise_level', 'living_conditions', 'safety',
            'basic_needs', 'academic_performance', 'study_load',
            'teacher_student_relationship', 'future_career_concerns', 'social_support',
            'peer_pressure', 'extracurricular_activities', 'bullying',
            'mental_score', 'academic_strain'
        ]
        df_input = df_input[kolom_sesuai]
        
        # 3. Inferensi Cerdas lewat Pipeline (Preprocess -> RFE -> Hybrid Stacking Classifier)
        prediction = model.predict(df_input)[0]
        
        # 4. Penyimpanan Rekam Medis & Akademik Siswa ke SQLite
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO students (
                name, className, anxiety_level, self_esteem, mental_health_history,
                depression, headache, blood_pressure, sleep_quality, breathing_problem,
                noise_level, living_conditions, safety, basic_needs, academic_performance,
                study_load, teacher_student_relationship, future_career_concerns,
                social_support, peer_pressure, extracurricular_activities, bullying,
                mental_score, academic_strain, stress_level
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('name', 'Anonymous'), data.get('className', 'Unknown'),
            df_input['anxiety_level'][0], df_input['self_esteem'][0], df_input['mental_health_history'][0],
            df_input['depression'][0], df_input['headache'][0], df_input['blood_pressure'][0],
            df_input['sleep_quality'][0], df_input['breathing_problem'][0], df_input['noise_level'][0],
            df_input['living_conditions'][0], df_input['safety'][0], df_input['basic_needs'][0],
            df_input['academic_performance'][0], df_input['study_load'][0], df_input['teacher_student_relationship'][0],
            df_input['future_career_concerns'][0], df_input['social_support'][0], df_input['peer_pressure'][0],
            df_input['extracurricular_activities'][0], df_input['bullying'][0],
            calc_mental_score, calc_academic_strain, int(prediction)
        ))
        conn.commit()
        conn.close()
        
        # 5. Mengembalikan JSON Response Valid ke Frontend JavaScript
        return jsonify({
            "status": "success",
            "stress_level": int(prediction),
            "message": "Analisis tingkat stres berhasil dieksekusi dan disimpan."
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Internal Server Error: {str(e)}"}), 500


@app.route("/data", methods=["GET"])
def get_data():
    """Endpoint untuk menyuplai data riwayat siswa ke tabel Dashboard Guru"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students ORDER BY created_at DESC")
        rows = cursor.fetchall()
        
        result = [dict(row) for row in rows]
        conn.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/stats", methods=["GET"])
def get_stats():
    """Endpoint ringkasan statistik untuk grafik/metrik agregasi umum di dashboard"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        stats = {}
        cursor.execute("SELECT COUNT(*) FROM students")
        stats['total'] = cursor.fetchone()[0]
        
        for level, label in [(0, 'low'), (1, 'moderate'), (2, 'high')]:
            cursor.execute("SELECT COUNT(*) FROM students WHERE stress_level = ?", (level,))
            stats[label] = cursor.fetchone()[0]
            
        conn.close()
        return jsonify(stats)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =========================================================
# 5. EKSEKUSI APLIKASI WEB FLASK
# =========================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)