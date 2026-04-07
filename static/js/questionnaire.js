/* ================================= */
/* QUESTIONNAIRE SYSTEM */
/* ================================= */

/* ================================ */
/* GAD-7 QUESTIONS */
/* ================================ */

const GAD7_QUESTIONS = [
  "Merasa gugup, cemas, atau tegang",
  "Tidak mampu menghentikan atau mengendalikan rasa khawatir",
  "Terlalu banyak mengkhawatirkan berbagai hal",
  "Kesulitan untuk merasa rileks",
  "Gelisah sehingga sulit untuk diam",
  "Mudah merasa kesal atau tersinggung",
  "Merasa takut seolah-olah sesuatu yang buruk akan terjadi",
];

/* ================================ */
/* PHQ-9 QUESTIONS */
/* ================================ */

const PHQ9_QUESTIONS = [
  "Kurang minat atau kesenangan dalam melakukan sesuatu",
  "Merasa sedih, tertekan, atau putus asa",
  "Kesulitan tidur atau tidur terlalu banyak",
  "Merasa lelah atau kekurangan energi",
  "Nafsu makan buruk atau makan berlebihan",
  "Merasa buruk tentang diri sendiri atau merasa gagal",
  "Kesulitan berkonsentrasi pada sesuatu",
  "Bergerak atau berbicara sangat lambat atau sebaliknya sangat gelisah",
  "Pikiran bahwa Anda akan lebih baik mati atau menyakiti diri sendiri",
];

/* ================================ */
/* ROSENBERG QUESTIONS */
/* ================================ */

const ROSENBERG_QUESTIONS = [
  "Saya merasa puas dengan diri saya",
  "Saya merasa tidak memiliki banyak hal yang bisa dibanggakan",
  "Saya merasa memiliki sejumlah kualitas yang baik",
  "Saya mampu melakukan sesuatu sebaik kebanyakan orang",
  "Saya merasa tidak memiliki banyak hal untuk dibanggakan",
  "Saya merasa tidak berguna pada beberapa kesempatan",
  "Saya merasa bahwa saya adalah orang yang berharga",
  "Saya berharap bisa lebih menghargai diri sendiri",
  "Kadang-kadang saya merasa gagal",
  "Saya memiliki sikap positif terhadap diri sendiri",
];

/* ================================= */
/* RENDER QUESTION FUNCTION */
/* ================================= */

function renderQuestions(containerId, questions, prefix) {
  const container = document.getElementById(containerId);

  questions.forEach((question, index) => {
    const questionNumber = index + 1;

    const html = `

        <div class="question">

            <p><b>${questionNumber}. ${question}</b></p>

            <select name="${prefix}${index}" required>

                <option value="">Pilih Jawaban</option>

                <option value="0">Tidak Pernah</option>
                <option value="1">Beberapa Hari</option>
                <option value="2">Lebih dari setengah hari</option>
                <option value="3">Hampir setiap hari</option>

            </select>

        </div>

        `;

    container.innerHTML += html;
  });
}

/* ================================= */
/* INITIALIZE QUESTIONNAIRE */
/* ================================= */

document.addEventListener("DOMContentLoaded", function () {
  renderQuestions("gad7", GAD7_QUESTIONS, "gad");
  renderQuestions("phq9", PHQ9_QUESTIONS, "phq");
  renderQuestions("rosenberg", ROSENBERG_QUESTIONS, "ros");
});
