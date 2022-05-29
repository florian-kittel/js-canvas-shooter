
const scoreElm = document.querySelector('#scoreElm');
const bigScoreElm = document.querySelector('#bigScoreElm');
let score = 0;


function loadScore() {
  const storage = localStorage.getItem('canvasGameScore');
  let highScores = [];

  if (storage) {
    highScores = JSON.parse(storage);

    highScoreTable.innerHTML = '';

    highScores.forEach(entry => {

      highScoreTable.innerHTML += `<tr>
      <td>${entry.score}</td>
      <td>${entry.state}</td>
      <td>${entry.enemies}</td>
      <td>${new Date(entry.date).toLocaleString()}</td>
      </tr>`;
    })

  }
}

function saveScore(score, state, killedEnemies) {
  const storage = localStorage.getItem('canvasGameScore');
  let highScores = [];
  if (storage) {
    highScores = JSON.parse(storage);
  }

  highScores.push({
    date: new Date(),
    state: state,
    enemies: killedEnemies,
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

export {
  loadScore,
  saveScore,
  updateScore
}