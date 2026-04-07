/* ================================= */
/* STUDENT FORM SYSTEM */
/* ================================= */

/* ================================ */
/* HITUNG SKOR GAD7 */
/* ================================ */

function calculateGAD7() {
  let total = 0;

  for (let i = 0; i < 7; i++) {
    const value = document.querySelector(`[name="gad${i}"]`);

    if (value) {
      total += parseInt(value.value || 0);
    }
  }

  return total;
}

/* ================================ */
/* HITUNG SKOR PHQ9 */
/* ================================ */

function calculatePHQ9() {
  let total = 0;

  for (let i = 0; i < 9; i++) {
    const value = document.querySelector(`[name="phq${i}"]`);

    if (value) {
      total += parseInt(value.value || 0);
    }
  }

  return total;
}

/* ================================ */
/* HITUNG SKOR ROSENBERG */
/* ================================ */

function calculateRosenberg() {
  let total = 0;

  /* pertanyaan yang perlu reverse score */
  const reverseIndex = [1, 4, 5, 7, 8];

  for (let i = 0; i < 10; i++) {
    let value = parseInt(document.querySelector(`[name="ros${i}"]`).value || 0);

    if (reverseIndex.includes(i)) {
      value = 3 - value;
    }

    total += value;
  }

  return total;
}

/* ================================ */
/* HANDLE FORM SUBMIT */
/* ================================ */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("studentForm");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    /* ============================= */
    /* HITUNG SKOR PSIKOLOGI */
    /* ============================= */

    const anxiety = calculateGAD7();
    const depression = calculatePHQ9();
    const selfEsteem = calculateRosenberg();

    /* ============================= */
    /* AMBIL IDENTITAS */
    /* ============================= */

    const name = document.getElementById("name").value;
    const className = document.getElementById("className").value;

    /* ============================= */
    /* FAKTOR TAMBAHAN */
    /* ============================= */

    const sleep_quality = toNumber(document.getElementById("sleep_quality").value);

    const study_load = toNumber(document.getElementById("study_load").value);

    const peer_pressure = toNumber(document.getElementById("peer_pressure").value);

    const bullying = toNumber(document.getElementById("bullying").value);

    const social_support = toNumber(document.getElementById("social_support").value);

    /* ============================= */
    /* DATA UNTUK MODEL */
    /* ============================= */

    const data = {
      name: name,
      className: className,

      anxiety_level: anxiety,
      depression: depression,
      self_esteem: selfEsteem,

      mental_health_history: 0,
      headache: 3,
      blood_pressure: 2,

      sleep_quality: sleep_quality,
      breathing_problem: 2,
      noise_level: 2,
      living_conditions: 3,
      safety: 3,
      basic_needs: 3,
      academic_performance: 3,

      study_load: study_load,
      teacher_student_relationship: 3,
      future_career_concerns: 3,

      social_support: social_support,
      peer_pressure: peer_pressure,
      extracurricular_activities: 2,
      bullying: bullying,
    };

    /* ============================= */
    /* KIRIM KE BACKEND */
    /* ============================= */

    try {
      await apiPost(CONFIG.ENDPOINTS.PREDICT, data);

      showAlert("Terima kasih telah mengisi kuesioner.");

      form.reset();
    } catch (error) {
      console.error(error);

      showAlert("Terjadi kesalahan saat mengirim data.");
    }
  });
});
