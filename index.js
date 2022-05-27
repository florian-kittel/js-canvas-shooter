const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const cx = canvas.width / 2;
const cy = canvas.height / 2;

const scoreElm = document.querySelector('#scoreElm');
const bigScoreElm = document.querySelector('#bigScoreElm');
const startGameBtn = document.querySelector('#startGameBtn');
const modalElm = document.querySelector('#modalElm');

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

function init() {
  player = new Player(cx, cy, 10, 'white');
  projectiles = [];
  particals = [];
  enemies = [];
  score = 0;
  updateScore(0);
}

function getValueFromRange(minum, maximum) {
  return Math.ceil(Math.random() * (maximum - minum) + minum);
}

function updateScore(number) {
  score += number;
  scoreElm.innerHTML = score;
}

function spawnEnemies() {
  enemySpawnInterval = setInterval(() => {
    const radius = getValueFromRange(4, 30);

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
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}



function animate() {
  animationId = requestAnimationFrame(animate);

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
    }


    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // Projectile hit enemy
      if (dist - enemy.radius / 2 - projectile.radius < 1) {

        // Create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
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
          updateScore(100);

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          projectiles.splice(projectileIndex, 1);
        } else {
          updateScore(250);

          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

const speed = 5;

canvas.addEventListener("click", fireBullet, false);

function fireBullet(event) {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed
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

