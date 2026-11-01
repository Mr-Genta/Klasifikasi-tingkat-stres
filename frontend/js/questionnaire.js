/* ================================= */
/* QUESTIONNAIRE SYSTEM - UPDATED */
/* ================================= */

const GAD7_QUESTIONS = [
  "Merasa gugup, cemas, atau tegang",
  "Tidak mampu menghentikan atau mengendalikan rasa khawatir",
  "Terlalu banyak mengkhawatirkan berbagai hal",
  "Kesulitan untuk merasa rileks",
  "Gelisah sehingga sulit untuk diam",
  "Mudah merasa kesal atau tersinggung",
  "Merasa takut seolah-olah sesuatu yang buruk akan terjadi",
];

const PHQ9_QUESTIONS = [
  "Kurang minat atau kesenangan dalam melakukan sesuatu",
  "Merasa sedih, tertekan, atau putus asa",
  "Kesulitan tidur atau tidur terlalu banyak",
  "Merasa ingin kabur atau kekurangan energi",
  "Nafsu makan buruk atau makan berlebihan",
  "Merasa buruk tentang diri sendiri atau merasa gagal",
  "Kesulitan berkonsentrasi pada sesuatu",
  "Bergerak atau berbicara sangat lambat atau sebaliknya sangat gelisah",
  "Pikiran bahwa Anda akan lebih baik mati atau menyakiti diri sendiri",
];

const ROSENBERG_QUESTIONS = [
  "Saya merasa puas dengan diri saya",
  "Kadang-kadang saya merasa saya tidak berguna sama sekali",
  "Saya merasa bahwa saya memiliki sejumlah kualitas yang baik",
  "Saya mampu melakukan hal-hal sebaik orang lain",
  "Saya merasa tidak banyak hal yang bisa saya banggakan",
  "Saya merasa berguna pada beberapa kesempatan",
  "Saya merasa bahwa saya adalah orang yang berharga",
  "Saya berharap bisa lebih menghargai diri sendiri",
  "Kadang-kadang saya merasa gagal",
  "Saya memiliki sikap positif terhadap diri sendiri",
];

/* ================================= */
/* RENDER QUESTION FUNCTION (CARD STYLE) */
/* ================================= */

function renderQuestions(containerId, questions, prefix) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // Bersihkan container

  questions.forEach((question, index) => {
    const questionNumber = index + 1;

    // Template Kartu Pertanyaan dengan Radio Button
    const html = `
        <div class="question-card">
            <p><b>${questionNumber}. ${question}</b></p>
            <div class="options-container">
                ${[0, 1, 2, 3]
                  .map(
                    (val) => `
                    <label class="option-item">
                        <input type="radio" name="${prefix}${index}" value="${val}" required 
                               ${val === 0 ? "" : ""}> 
                        <span class="option-label">${getOptionText(val)}</span>
                    </label>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `;

    container.innerHTML += html;
  });
}

/**
 * Mengonversi nilai angka menjadi teks opsi
 */
function getOptionText(val) {
  const texts = ["Tidak Pernah", "Jarang", "Sering", "Hampir Selalu"];
  return texts[val] || "";
}

/**
 * Fungsi pembantu untuk mengambil nilai radio yang terpilih
 */
function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? parseInt(selected.value) : 0;
}

/* ================================= */
/* INITIALIZE QUESTIONNAIRE */
/* ================================= */

document.addEventListener("DOMContentLoaded", function () {
  renderQuestions("gad7", GAD7_QUESTIONS, "gad");
  renderQuestions("phq9", PHQ9_QUESTIONS, "phq");
  renderQuestions("rosenberg", ROSENBERG_QUESTIONS, "ros");
});
