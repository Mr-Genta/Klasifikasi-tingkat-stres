/* ================================= */
/* CONFIGURATION FILE - UPDATED */
/* ================================= */

const CONFIG = {
  /* =============================== */
  /* BACKEND API */
  /* =============================== */
  // Jika Anda hosting di PythonAnywhere, ganti URL ini
  // contoh: "https://username.pythonanywhere.com"
  API_URL: "http://127.0.0.1:5000",

  ENDPOINTS: {
    PREDICT: "/predict",
    GET_DATA: "/data",
    GET_STATS: "/stats",
  },

  /* =============================== */
  /* LOGIN GURU (DEMO) */
  /* =============================== */
  AUTH: {
    USERNAME: "teacher",
    PASSWORD: "123",
  },

  /* =============================== */
  /* LABEL STRESS LEVEL */
  /* Sesuai dengan output model ML */
  /* =============================== */
  STRESS_LABEL: {
    0: "Rendah",
    1: "Sedang",
    2: "Tinggi",
  },

  /* =============================== */
  /* SKALA KUESIONER */
  /* Batas maksimal skor per kuesioner */
  /* =============================== */
  SCALE: {
    GAD7_MAX: 21,
    PHQ9_MAX: 27,
    ROSENBERG_MAX: 30,
    // Skala fitur tambahan (0-5) sesuai dataset
    FEATURE_MAX: 5,
  },
};
