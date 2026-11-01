// Variabel global lokal untuk menyimpan data siswa yang diambil dari server
let globalStudentsData = [];

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === CONFIG.AUTH.USERNAME && password === CONFIG.AUTH.PASSWORD) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadDashboard();
  } else {
    showAlert("Username atau password salah.");
  }
}

async function loadDashboard() {
  loadStats();
  loadStudentTable();
}

async function loadStats() {
  try {
    const stats = await apiGet(CONFIG.ENDPOINTS.GET_STATS);
    document.getElementById("totalStudents").innerText = stats.total;
    document.getElementById("lowStress").innerText = stats.low;
    document.getElementById("moderateStress").innerText = stats.moderate;
    document.getElementById("highStress").innerText = stats.high;
  } catch (error) {
    console.error("Gagal memuat statistik dashboard:", error);
  }
}

async function loadStudentTable() {
  try {
    const students = await apiGet(CONFIG.ENDPOINTS.GET_DATA);
    globalStudentsData = students;

    const tableBody = document.getElementById("tableBody");
    clearTable("tableBody");

    students.forEach(function (student, index) {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.className}</td>
                <td>${student.anxiety_level}</td>
                <td>${student.depression}</td>
                <td><span class="status-badge-inline" id="badge-${index}">${getStressLabel(student.stress_level)}</span></td>
                <td><button class="btn-table-action" onclick="viewStudentDetail(${index})">Lihat Detail</button></td>
            `;
      tableBody.appendChild(row);

      const badge = document.getElementById(`badge-${index}`);
      if (student.stress_level === 2) {
        badge.style.color = "#ef4444";
        badge.style.fontWeight = "bold";
      } else if (student.stress_level === 1) {
        badge.style.color = "#f59e0b";
        badge.style.fontWeight = "bold";
      } else {
        badge.style.color = "#10b981";
      }
    });
  } catch (error) {
    console.error("Gagal memuat tabel data siswa:", error);
  }
}

function viewStudentDetail(index) {
  const student = globalStudentsData[index];
  if (!student) return;

  // 1. Identitas & Hasil Kalkulasi Model
  document.getElementById("dtName").innerText = student.name;
  document.getElementById("dtClass").innerText = student.className;
  document.getElementById("dtAnxiety").innerText = student.anxiety_level + " / 21";
  document.getElementById("dtDepression").innerText = student.depression + " / 27";
  document.getElementById("dtMentalScore").innerText = student.mental_score;

  // 2. Faktor Akademik, Kondisi Fisik & Lingkungan Terpilih (Murni 14 Fitur Sinkron)
  document.getElementById("dtBlood").innerText = student.blood_pressure;
  document.getElementById("dtAcademicPerf").innerText = student.academic_performance;
  document.getElementById("dtStudyLoad").innerText = student.study_load;
  document.getElementById("dtCareer").innerText = student.future_career_concerns;
  document.getElementById("dtTeacherRel").innerText = student.teacher_student_relationship;
  document.getElementById("dtHeadache").innerText = student.headache;
  document.getElementById("dtSleep").innerText = student.sleep_quality;
  document.getElementById("dtSafety").innerText = student.safety;
  document.getElementById("dtNeeds").innerText = student.basic_needs;
  document.getElementById("dtSupport").innerText = student.social_support;
  document.getElementById("dtPeer").innerText = student.peer_pressure;
  document.getElementById("dtExtra").innerText = student.extracurricular_activities;
  document.getElementById("dtAcademicStrain").innerText = student.academic_strain ? student.academic_strain.toFixed(2) : "0.00";

  const lbl = document.getElementById("dtPredictionLabel");
  const guidelinesContainer = document.getElementById("dtHandlingGuidelines");
  const box = document.getElementById("handlerBox");

  lbl.innerText = getStressLabel(student.stress_level).toUpperCase();

  let guidelinesHTML = "";

  if (student.stress_level === 0) {
    box.style.background = "#e6f4ea";
    box.style.borderColor = "#b7e1cd";
    lbl.style.color = "#137333";
    guidelinesHTML = `
      <b>Analisis Situasional:</b> Siswa berada dalam kondisi psikologis yang prima, adaptif, dan mampu mengelola beban akademik di lingkungan sekolah dengan sangat baik.<br><br>
      <b>Saran Tindakan untuk Guru BK:</b>
      <ul style="margin-left: 20px; margin-top: 5px;">
        <li>Berikan apresiasi dan penguatan positif (*positive reinforcement*) secara kasual agar siswa mempertahankan ritme belajarnya.</li>
        <li>Masukkan siswa ke dalam program bimbingan klasikal normatif untuk pengembangan diri umum.</li>
        <li>Jadikan siswa sebagai salah satu kandidat konselor sebaya (*peer counselor*) untuk membantu teman-temannya yang berada di level stres sedang.</li>
      </ul>
    `;
  } else if (student.stress_level === 1) {
    box.style.background = "#fef7e0";
    box.style.borderColor = "#feefc3";
    lbl.style.color = "#b06000";
    guidelinesHTML = `
      <b>Analisis Situasional:</b> Siswa mulai mengalami hambatan psikologis akibat tekanan eksternal (beban tugas/kecemasan karir). Jika diabaikan, kondisi ini berpotensi menurunkan kapabilitas akademik secara jangka panjang.<br><br>
      <b>Saran Tindakan untuk Guru BK:</b>
      <ul style="margin-left: 20px; margin-top: 5px;">
        <li>Lakukan pemanggilan persuasif yang bersifat non-formal di ruang BK (*soft counseling*).</li>
        <li>Bantu siswa menyusun skala prioritas tugas sekolah dan teknik manajemen waktu (*time management*) yang efektif.</li>
        <li>Libatkan siswa dalam konseling kelompok terarah mengenai regulasi emosi dan teknik relaksasi kognitif.</li>
        <li>Lakukan komunikasi preventif dengan Wali Kelas guna memantau perkembangan nilai rapor siswa.</li>
      </ul>
    `;
  } else {
    box.style.background = "#fce8e6";
    box.style.borderColor = "#fad2cf";
    lbl.style.color = "#c5221f";

    guidelinesHTML = `
      <b>Analisis Situasional:</b> Siswa sedang mengalami krisis emosional atau tekanan mental akut. Terjadi anomali destruktif pada kualitas tidur, sakit kepala fisik, atau disfungsi relasi lingkungan sosial sekolah.<br><br>
      <b>Saran Tindakan untuk Guru BK (INTERVENSI SEGERA):</b>
      <ul style="margin-left: 20px; margin-top: 5px;">
        <li><b>Wajib melaksanakan Konseling Individu Tatap Muka</b> secara intensif dalam waktu 1x24 jam di ruang Bimbingan Konseling.</li>
        <li>Lakukan pemanggilan khusus kepada Orang Tua / Wali murid guna menyamakan persepsi pemulihan mental anak di rumah.</li>
        <li>Jika dalam 2 kali sesi konseling tidak ada perubahan perilaku atau terindikasi gejala klinis berat (insomnia kronis, depresi berat), **segera lakukan rujukan klinis (referral)** ke Psikolog atau Psikiater terdekat.</li>
      </ul>
    `;
  }

  guidelinesContainer.innerHTML = guidelinesHTML;
  document.getElementById("teacherDetailModal").style.display = "flex";
}

function closeTeacherModal() {
  document.getElementById("teacherDetailModal").style.display = "none";
}

/**
 *  FUNGSI: Logout Guru BK
 */
function logout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  globalStudentsData = [];
  console.log(" Sesi Guru BK berhasil ditutup dengan aman.");
}
