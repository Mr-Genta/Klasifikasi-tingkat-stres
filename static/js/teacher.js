/* ================================= */
/* TEACHER PORTAL SYSTEM */
/* ================================= */

/* ================================ */
/* LOGIN GURU */
/* ================================ */

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

/* ================================ */
/* LOAD DASHBOARD */
/* ================================ */

async function loadDashboard() {
  loadStats();
  loadStudentTable();
}

/* ================================ */
/* LOAD STATISTIK */
/* ================================ */

async function loadStats() {
  try {
    const stats = await apiGet(CONFIG.ENDPOINTS.GET_STATS);

    document.getElementById("totalStudents").innerText = stats.total;
    document.getElementById("lowStress").innerText = stats.low;
    document.getElementById("moderateStress").innerText = stats.moderate;
    document.getElementById("highStress").innerText = stats.high;
  } catch (error) {
    console.error(error);
  }
}

/* ================================ */
/* LOAD DATA SISWA */
/* ================================ */

async function loadStudentTable() {
  try {
    const students = await apiGet(CONFIG.ENDPOINTS.GET_DATA);

    const tableBody = document.getElementById("tableBody");

    clearTable("tableBody");

    students.forEach(function (student) {
      const row = document.createElement("tr");

      row.innerHTML = `

                <td>${student.name}</td>
                <td>${student.className}</td>
                <td>${student.anxiety_level}</td>
                <td>${student.depression}</td>
                <td>${student.self_esteem}</td>
                <td>${getStressLabel(student.stress_level)}</td>

            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}
