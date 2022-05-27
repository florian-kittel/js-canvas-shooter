const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const cx = canvas.width / 2;
const cy = canvas.height / 2;

let bulletSpeed = 5;
let spawnTime = 2000;
let spawnSizeMin = 5;
let spawnSizeMax = 50;
let enemySpeed = 0.5;


const scoreElm = document.querySelector('#scoreElm');
const bigScoreElm = document.querySelector('#bigScoreElm');
const startGameBtn = document.querySelector('#startGameBtn');
const modalElm = document.querySelector('#modalElm');
const enemyState = document.querySelector('#enemyState');
const wonElm = document.querySelector('#wonElm');
const highScoreTable = document.querySelector('#highScoreTable');

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius,
      0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius,
      0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius,
      0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const friction = 0.98;
class Partical {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius,
      0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

let player = new Player(cx, cy, 10, 'white');
let projectiles = [];
let particals = [];
let enemies = [];
let score = 0;

let animationId;
let enemySpawnInterval;

let maxEnemies = 100;
let killedEnemies = 0;
let spawedEnemies = 0;

function init() {
  player = new Player(cx, cy, 10, 'white');
  projectiles = [];
  particals = [];
  enemies = [];
  score = 0;
  updateScore(0);
  spawedEnemies = 0;
  killedEnemies = 0;
  updateEnemyState();
}

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
      <td>${entry.date}</td>
      </tr>`;
    })

  }
}

function saveScore(score, state) {
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

function getValueFromRange(minum, maximum) {
  return Math.ceil(Math.random() * (maximum - minum) + minum);
}

function updateScore(number) {
  score += number;
  scoreElm.innerHTML = score;
}

function updateEnemyState() {
  enemyState.innerHTML = killedEnemies + '/' + maxEnemies;
}

function spawnEnemies() {
  spawedEnemies++;

  spawnTime = 4000;
  enemySpeed = 0.5;

  if (killedEnemies > 20) {
    spawnTime = 3000;
    enemySpeed = 0.75;
  }
  if (killedEnemies > 40) {
    spawnTime = 2000;
    enemySpeed = 1;
  }

  if (killedEnemies > 60) {
    spawnTime = 1000;
    enemySpeed = 1.5;
  }

  if (killedEnemies > 80) {
    spawnTime = 500;
    enemySpeed = 2;
  }

  let radius = getValueFromRange(spawnSizeMin, spawnSizeMax);

  if (killedEnemies > 4 && killedEnemies < 6) {
    spawnTime = 300;
  }

  if (killedEnemies > 11 && killedEnemies < 13) {
    radius = getValueFromRange(spawnSizeMin, spawnSizeMax);
    spawnTime = 300;
  }

  if (killedEnemies > 20 && killedEnemies < 22) {
    radius = getValueFromRange(spawnSizeMin * 2, spawnSizeMax);
    spawnTime = 500;
  }

  if (killedEnemies > 41 && killedEnemies < 43) {
    radius = getValueFromRange(spawnSizeMin * 2, spawnSizeMax * 1.5);
    spawnTime = 500;
  }

  if (spawedEnemies === 5) {
    radius = 100;
    enemySpeed = 1;
  }

  if (spawedEnemies === 20) {
    radius = 150;
  }

  if (spawedEnemies === 30) {
    radius = 100;
  }

  if (spawedEnemies === 30) {
    radius = 150;
  }

  if (spawedEnemies === 40) {
    radius = 200;
  }

  if (spawedEnemies === 50) {
    radius = 100;
  }

  if (spawedEnemies === 70) {
    radius = 200;
  }

  let x = 0;
  let y = 0;

  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    y = Math.random() * canvas.height;
  } else {
    x = Math.random() * canvas.width;
    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
  }

  const color = `hsl(${getValueFromRange(0, 360)}, 50%, 50%)`;

  const angle = Math.atan2(
    canvas.height / 2 - y,
    canvas.width / 2 - x
  );

  const velocity = {
    x: Math.cos(angle) * enemySpeed,
    y: Math.sin(angle) * enemySpeed
  }

  enemies.push(new Enemy(x, y, radius, color, velocity));
  sndAppear01.play();



  enemySpawnInterval = setTimeout(() => spawnEnemies(), spawnTime + Math.random() * 100);
}


const sndShot = new Howl({
  src: ['sounds/shot.ogg']
});

const sndHit = new Howl({
  src: ['sounds/explodemini.ogg'],
});

const sndExplode = new Howl({
  src: ['sounds/explode.ogg']
});

const sndAppear01 = new Howl({
  src: ['sounds/appear01.mp3']
});

const sndAppear02 = new Howl({
  src: ['sounds/appear02.mp3']
});

const sndAppear03 = new Howl({
  src: ['sounds/appear03.mp3']
});

const sndLose = new Howl({
  src: ['sounds/lose.mp3']
});

const sndWon = new Howl({
  src: ['sounds/won.ogg']
});

const sndEBgMusic = new Howl({
  src: ['sounds/ObservingTheStar.ogg'],
  autoplay: true,
  loop: true,
});


function animate() {
  animationId = requestAnimationFrame(animate);

  // Won game
  if (killedEnemies === maxEnemies) {
    console.log('Won game');
    cancelAnimationFrame(animationId);
    modalElm.style.display = 'flex';
    bigScoreElm.innerHTML = score;

    clearInterval(enemySpawnInterval);

    sndWon.play();
    wonElm.style.display = 'block';
    saveScore(score, 'won');
    loadScore();
    return;
  }

  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  particals.forEach((partical, particalIndex) => {
    if (partical.alpha <= 0) {
      setTimeout(() => {
        particals.splice(particalIndex, 1);
      }, 0)
    } else {
      partical.update();
    }
  });

  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();

    if (projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
      }, 0)
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // End Game

    if (dist - enemy.radius / 2 - player.radius < 1) {
      console.log('End game')
      cancelAnimationFrame(animationId);
      modalElm.style.display = 'flex';
      bigScoreElm.innerHTML = score;

      clearInterval(enemySpawnInterval);
      wonElm.style.display = 'none';
      sndLose.play();
      saveScore(score, 'lose');
      loadScore();
      return;
    }


    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // Projectile hit enemy
      if (dist - enemy.radius / 2 - projectile.radius < 1) {

        // Create explosions
        let particleSize = enemy.radius < 20 ? enemy.radius * 2 : enemy.radius;
        for (let i = 0; i < particleSize; i++) {
          particals.push(new Partical(
            projectile.x,
            projectile.y,
            Math.random() * 2,
            enemy.color,
            {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6)
            }
          ))
        }

        if (enemy.radius - 10 > 10) {
          // enemy.radius -= 10;
          sndHit.play();
          updateScore(100);

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          projectiles.splice(projectileIndex, 1);
        } else {
          updateScore(250);
          sndExplode.play();

          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
            killedEnemies++;
            updateEnemyState();
          }, 0);
        }
      }
    });
  });
}


canvas.addEventListener("click", fireBullet, false);

let mousePosition = { x: 0, y: 0 };
document.addEventListener('mousemove', function (mouseMoveEvent) {
  mousePosition.clientX = mouseMoveEvent.pageX;
  mousePosition.clientY = mouseMoveEvent.pageY;
}, false);

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    fireBullet(mousePosition);
  }
})

function fireBullet(event) {

  sndShot.play();

  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle) * bulletSpeed,
    y: Math.sin(angle) * bulletSpeed
  }

  projectiles.push(
    new Projectile(
      canvas.width / 2,
      canvas.height / 2,
      5,
      'white',
      velocity
    )
  );
}

startGameBtn.addEventListener('click', () => {
  init();
  animate();
  spawnEnemies();
  modalElm.style.display = 'none';
});

loadScore();