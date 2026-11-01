// 1. Fungsi Mengaktifkan Form Skrining (Dipanggil dari tombol halaman awalan)
function startClassification() {
  document.getElementById("studentWelcome").style.display = "none";
  document.getElementById("classificationForm").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 2.  FUNGSI: Tombol Kembali jika tidak ingin mengisi
function backToWelcome() {
  document.getElementById("classificationForm").style.display = "none";
  document.getElementById("studentWelcome").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 3. Fungsi menghitung total skor radio button berdasarkan komponen kontainer kuesioner
function calculateCategoryScore(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return 0;
  const selectedRadios = container.querySelectorAll('input[type="radio"]:checked');
  let score = 0;
  selectedRadios.forEach((radio) => {
    score += parseInt(radio.value);
  });
  return score;
}

// 4. Fungsi Pengiriman Survey Skrining Utama
async function submitSurvey() {
  try {
    // A. Ambil Objek Elemen Identitas
    const nameElement = document.getElementById("studentName");
    const classElement = document.getElementById("studentClass");

    if (!nameElement || !classElement) {
      alert("Error: Elemen input Nama atau Kelas tidak ditemukan di HTML.");
      return;
    }

    const name = nameElement.value.trim();
    const studentClass = classElement.value.trim();

    if (!name || !studentClass) {
      alert("Mohon lengkapi Nama dan Kelas Anda terlebih dahulu.");
      return;
    }

    // VALIDASI NAMA: WAJIB HURUF DAN SPASI SAJA
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      alert("Peringatan Pengisian Ulang:\nNama Lengkap hanya boleh berisi karakter huruf (A-Z) dan spasi! Silakan periksa kembali input Anda.");
      nameElement.focus(); // Mengarahkan kursor ke elemen input yang benar
      return;
    }

    // B. Validasi kelengkapan kuesioner psikologis (7 pertanyaan GAD + 9 pertanyaan PHQ = 16)
    const totalQuestions = 16;
    const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;

    if (answeredQuestions < totalQuestions) {
      alert("Mohon jawab semua pertanyaan kuesioner psikologis (GAD-7 & PHQ-9) sebelum melanjutkan.");
      return;
    }

    // C. Hitung Skor Kuesioner Psikologis Klinis (Penyusun Fitur mental_score di Backend)
    const gad7Score = calculateCategoryScore("gad7");
    const phq9Score = calculateCategoryScore("phq9");
    const rosenbergScore = 15;

    // D. Tangkap Elemen Select dari Form Berdasarkan 14 Fitur yang Digunakan
    const academicPerformance = parseFloat(document.getElementById("academic_performance").value);
    const studyLoad = parseFloat(document.getElementById("study_load").value);
    const futureCareerConcerns = parseFloat(document.getElementById("future_career_concerns").value);
    const teacherStudentRelationship = parseFloat(document.getElementById("teacher_student_relationship").value);
    const headache = parseFloat(document.getElementById("headache").value);
    const sleepQuality = parseFloat(document.getElementById("sleep_quality").value);
    const safety = parseFloat(document.getElementById("safety").value);
    const basicNeeds = parseFloat(document.getElementById("basic_needs").value);
    const socialSupport = parseFloat(document.getElementById("social_support").value);
    const bloodPressure = parseFloat(document.getElementById("blood_pressure").value);
    const peerPressure = parseFloat(document.getElementById("peer_pressure").value);
    const extracurricularActivities = parseFloat(document.getElementById("extracurricular_activities").value);

    // E. SMART AUTO-FILL: Isi sisa fitur opsional non-RFE dengan nilai default aman
    const mentalHealthHistoryDefault = 0;
    const livingConditionsDefault = 3;
    const bullyingDefault = 0;
    const breathingProblemDefault = 0;
    const noiseLevelDefault = 2;

    // F. Satukan Semua Parameter Menjadi Payload JSON Terstruktur Sesuai 14 Fitur
    const payload = {
      name: name,
      className: studentClass,
      anxiety_level: gad7Score,
      depression: phq9Score,
      self_esteem: rosenbergScore,
      academic_performance: academicPerformance,
      study_load: studyLoad,
      future_career_concerns: futureCareerConcerns,
      teacher_student_relationship: teacherStudentRelationship,
      mental_health_history: mentalHealthHistoryDefault,
      headache: headache,
      sleep_quality: sleepQuality,
      living_conditions: livingConditionsDefault,
      safety: safety,
      basic_needs: basicNeeds,
      social_support: socialSupport,
      bullying: bullyingDefault,
      blood_pressure: bloodPressure,
      breathing_problem: breathingProblemDefault,
      noise_level: noiseLevelDefault,
      peer_pressure: peerPressure,
      extracurricular_activities: extracurricularActivities,
    };

    // G. Ubah status tombol menjadi loading
    const btn = document.querySelector(".btn-submit-all");
    if (btn) {
      btn.innerText = "Kecerdasan Buatan Sedang Menganalisis...";
      btn.disabled = true;
    }

    // H. Kirim ke Backend API Flask
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      showResultModal(name);
    } else {
      alert("Gagal memproses klasifikasi: " + (result ? result.message : "Error tidak diketahui"));
    }
  } catch (error) {
    console.error("Error Klasifikasi Survey:", error);
    alert("Terjadi kesalahan sistem saat memproses skrining: " + error.message);
  } finally {
    const btn = document.querySelector(".btn-submit-all");
    if (btn) {
      btn.innerText = "Analisis Tingkat Stres Anda";
      btn.disabled = false;
    }
  }
}

// 5. REVISI FUNGSI MODAL: Konfirmasi aman tanpa membocorkan level stres langsung ke siswa
function showResultModal(name) {
  const modal = document.getElementById("resultModal");
  const resName = document.getElementById("resName");

  if (resName) resName.innerText = name;
  if (modal) modal.style.display = "flex";
}
