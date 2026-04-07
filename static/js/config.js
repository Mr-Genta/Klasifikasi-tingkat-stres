/* ================================= */
/* CONFIGURATION FILE */
/* ================================= */

const CONFIG = {
  BASE_URL: "https://your-app-name.onrender.com",
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
  /* =============================== */

  STRESS_LABEL: {
    0: "Rendah",
    1: "Sedang",
    2: "Tinggi",
  },

  /* =============================== */
  /* SKALA KUESIONER */
  /* =============================== */

  SCALE: {
    GAD7_MAX: 21,
    PHQ9_MAX: 27,
    ROSENBERG_MAX: 30,
  },
};
