let score = 0;
let grid = 16;
let count = 0;

let snake = {x:16, y:160, dx: grid, dy: 0, cells: [], maxCells: 255};
let apple = {x:256, y:256};

let retryBtn = document.getElementById("retryBtn");

let canvas = document.getElementById('gameScrn');
let ctx = canvas.getContext('2d');

const snakeGrad = ctx.createLinearGradient(snake.x, snake.y, snake.x*2, snake.y*2)

snakeGrad.addColorStop(0, "lightblue");
snakeGrad.addColorStop(1, "darkblue");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// --- new helper function to safely place apple ---
function placeApple() {
  let overlapping;
  do {
    overlapping = false;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;

    // ensure apple doesn't spawn inside snake
    for (let cell of snake.cells) {
      if (apple.x === cell.x && apple.y === cell.y) {
        overlapping = true;
        break;
      }
    }
  } while (overlapping);
}

function loop() {
  requestAnimationFrame(loop);

  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 15) {
    return;
  }

  count = 0;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // move snake by its velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake one cell at a time
  ctx.fillStyle = snakeGrad;
  snake.cells.forEach(function(cell, index) {
    ctx.fillRect(cell.x, cell.y, grid-1, grid-1);

    // snake ate apple
    if (snake.x === apple.x && snake.y === apple.y) {
      snake.maxCells++;
      placeApple();
      playSounds("eat")
    }

    // check collision with all cells after this one
    for (let i = index + 1; i < snake.cells.length; i++) {
      // snake occupies same space as a body part OR hits wall
      
      
      
      if (
        (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) ||
        snake.x >= canvas.width || snake.x < 0 ||
        snake.y >= canvas.height || snake.y < 0
      ) {
        // reset game
        snake.x = 16;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 0;
        snake.dx = 0;
        snake.dy = 0;

        // hide apple off-screen until retry
        apple.x = 10000;
        apple.y = 10000;

        retryBtn.style.display = "initial";
        playSounds("death")
      }
    }
  });
}

function retry() {
  snake.x = 16;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;

  placeApple();
  retryBtn.style.display = "none";
};

function playSounds(event) {
  if (event == "death") {
    var death = new Audio("../assets/audio/bonk.ogg");
    death.play();
  } else if (event == "eat") {
    var eat = new Audio("../assets/audio/burp.mp3");
    eat.play()
  }
}

function mobileCtrl(key) {
  if (key == "left" && snake.dx !== grid) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (key == "right" && snake.dx !== -grid) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (key == "up" && snake.dy !== grid) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (key == "down" && snake.dy !== -grid) {
    snake.dy = grid;
    snake.dx = 0;
  }
}

if (snake.maxCells == 256) {
  console.log("Get Out!");
};

requestAnimationFrame(loop);
