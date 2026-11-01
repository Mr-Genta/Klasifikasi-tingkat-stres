/* ================================= */
/* UTILITY FUNCTIONS */
/* ================================= */

/* ================================ */
/* API REQUEST (POST) */
/* ================================ */

async function apiPost(endpoint, data) {
  try {
    const response = await fetch(CONFIG.API_URL + endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API POST ERROR:", error);

    showAlert("Terjadi kesalahan saat mengirim data.");
  }
}

/* ================================ */
/* API REQUEST (GET) */
/* ================================ */

async function apiGet(endpoint) {
  try {
    const response = await fetch(CONFIG.API_URL + endpoint);

    return await response.json();
  } catch (error) {
    console.error("API GET ERROR:", error);

    showAlert("Terjadi kesalahan saat mengambil data.");
  }
}

/* ================================ */
/* ALERT */
/* ================================ */

function showAlert(message) {
  alert(message);
}

/* ================================ */
/* STRESS LABEL */
/* ================================ */

function getStressLabel(level) {
  if (level in CONFIG.STRESS_LABEL) {
    return CONFIG.STRESS_LABEL[level];
  }

  return "Unknown";
}

/* ================================ */
/* CLEAR TABLE */
/* ================================ */

function clearTable(tableId) {
  const table = document.getElementById(tableId);

  table.innerHTML = "";
}

/* ================================ */
/* FORMAT DATE */
/* ================================ */

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("id-ID") + " " + date.toLocaleTimeString("id-ID");
}

/* ================================ */
/* FORM VALIDATION */
/* ================================ */

function validateInput(value, min, max) {
  const number = parseInt(value);

  if (number < min) return min;

  if (number > max) return max;

  return number;
}

/* ================================ */
/* NUMBER PARSER */
/* ================================ */

function toNumber(value) {
  return parseInt(value) || 0;
}
