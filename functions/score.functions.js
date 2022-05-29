
const scoreElm = document.querySelector('#scoreElm');
const bigScoreElm = document.querySelector('#bigScoreElm');
const versionElm = document.querySelector('#versionElm');
let score = 0;
let majorVersion = '0';
let minorVersion = '2';

function updateVersion() {
  versionElm.innerHTML = `v${majorVersion}.${minorVersion}`;
}

function loadScore() {
  const storage = localStorage.getItem('canvasGameScore');
  const version = localStorage.getItem('canvasGameVersion');

  if (!version) {
    localStorage.setItem('canvasGameVersion', `${majorVersion}.${minorVersion}`);
    localStorage.setItem('canvasGameScore', JSON.stringify([]));
    storage = [];
  }

  let highScores = [];

  if (storage) {
    highScores = JSON.parse(storage);

    highScoreTable.innerHTML = '';

    highScores.forEach(entry => {

      highScoreTable.innerHTML += `<tr>
      <td>${entry.score}</td>
      <td>${entry.state}</td>
      <td>${entry.enemies}</td>
      <td>${entry.duration} s</td>
      <td>${new Date(entry.date).toLocaleString()}</td>
      </tr>`;
    })

  }
}

function saveScore(state, killedEnemies = 0, duration = 0) {
  const storage = localStorage.getItem('canvasGameScore');

  let highScores = [];
  if (storage) {
    highScores = JSON.parse(storage);
  }

  highScores.push({
    date: new Date(),
    state: state,
    enemies: killedEnemies,
    duration: duration,
    score: score
  });

  highScores.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));

  highScores.splice(9);

  localStorage.setItem('canvasGameScore', JSON.stringify(highScores));
}


function updateScore(number) {
  score += number;
  scoreElm.innerHTML = score;
  bigScoreElm.innerHTML = score;
}

function resetScore() {
  score = 0;
  updateScore(0);
}

export {
  loadScore,
  saveScore,
  updateScore,
  resetScore,
  updateVersion
}