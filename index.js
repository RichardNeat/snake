const squares = document.querySelectorAll(".gridsquare");
const gameGrid = document.querySelector(".gamegrid");
const gameBody = document.getElementsByTagName("body");
const scorePara = document.createElement("p");
const highScorePara = document.createElement("p");
const playAgainButton = document.createElement("button");
playAgainButton.innerText = "🐍 PLAY AGAIN 🐍";
playAgainButton.addEventListener('click', playAgain);

// SNAKE INDICES
const snake = {
  front: 189,
  mid: [187, 188],
};

// ARRANGE VARIABLES FOR DIRECTION, INTERVAL TICK, GAME SPEED AND SCORE
const directionDecisions = {
  'KeyW': {direction: "up", cantGo: 'down', gridShift: -20},
  'KeyA': {direction: "left", cantGo: 'right', gridShift: -1},
  'KeyS': {direction: "down", cantGo: 'up', gridShift: 20},
  'KeyD': {direction: "right", cantGo: 'left', gridShift: 1},
};
let direction = "up";
let inputGiven = false;
let gridShift = -20;
let gameActive = false;
let gameStart = 0;
let foodActive = false;
let foodIndex = 0;
let randomFoodNum = 0;
let gameSpeed = 500;
let score = 0;
scorePara.innerText = `Current score: ${score}`;
highScorePara.innerText = `High Score: ${localStorage.getItem('highScore') || 0}`;
gameBody[0].appendChild(scorePara);
gameBody[0].appendChild(highScorePara);

// SET INDICES FOR LOSE SCREEN
const loseSquares = [
  43, 64, 85, 66, 47, 105, 125, 129, 130, 131, 109, 89, 69, 49, 50, 51, 71, 91,
  111, 133, 113, 93, 73, 53, 134, 135, 115, 95, 75, 55, 202, 222, 242, 262, 282,
  283, 284, 286, 266, 246, 226, 206, 207, 208, 228, 248, 268, 288, 287, 290,
  291, 292, 272, 252, 251, 250, 230, 210, 211, 212, 214, 215, 216, 234, 254,
  255, 274, 294, 295, 296, 298, 258, 238, 218,
];

// ADD GRID BACKGROUND
function snakeDesign() {
  squares[snake.front].classList.add("currsquare");
  snake.mid.forEach((snakePart) => {
    squares[snakePart].classList.add("currsquare");
  });
}
snakeDesign();

// DIRECTIONAL INPUT
document.addEventListener("keydown", (event) => {
  if (gameActive && !inputGiven) {
    if (event.code === "KeyW" || event.code === 'ArrowUp') {
      if (direction !== "down") {
        gridShift = -20;
        direction = "up";
        inputGiven = true;
      }
    }
    if (event.code === "KeyA" || event.code === 'ArrowLeft') {
      if (direction !== "right") {
        gridShift = -1;
        direction = "left";
        inputGiven = true;
      }
    }
    if (event.code === "KeyS" || event.code === 'ArrowDown') {
      if (direction !== "up") {
        gridShift = 20;
        direction = "down";
        inputGiven = true;
      }
    }
    if (event.code === "KeyD" || event.code === 'ArrowRight') {
      if (direction !== "left") {
        gridShift = 1;
        direction = "right";
        inputGiven = true;
      }
    }
  };
});

// MOVEMENT TICK
const movementTick = () => {
  if (
    snake.front % 20 === 0 && direction === "left" ||
    snake.front % 20 === 19 && direction === "right" ||
    snake.front < 21 && direction === "up" ||
    snake.front > 380 && direction === "down" ||
    snake.mid.includes(snake.front)
  ) {
    youLose();
  } else {
    clearSnake();
    snake.mid.push(snake.front);
    snake.front += gridShift;
    snake.mid.shift();
    const hasFood = squares[snake.front].classList.value.includes("food");
    snakeDesign();
    if (hasFood) {
      squares[snake.front].classList.remove(`food${randomFoodNum}`);
      foodActive = false;
      addFood();
      growSnake();
    }
  }
  inputGiven = false;
};

// START/PAUSE LOGIC
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (!gameActive) {
      gameGrid.classList.remove("pause_screen");
      gameStart = setInterval(movementTick, gameSpeed);
      gameActive = true;
      addFood();
    } else {
      gameGrid.classList.add("pause_screen");
      clearInterval(gameStart);
      gameActive = false;
    }
  }
});

// GAME LOSE
function youLose() {
  clearSnake();
  clearInterval(gameStart);
  gameActive = false;
  squares[foodIndex].className = "gridsquare";
  gameGrid.classList.add("lose_screen");
  loseSquares.forEach((index) => {
    squares[index].className = "currsquare";
  });
  if (!localStorage.getItem("highScore") || score > localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", score);
    highScorePara.innerText = `High Score: ${localStorage.getItem('highScore')}`;
  };
  gameBody[0].appendChild(playAgainButton);
}

// REMOVE ALL SNAKE BACKGROUND
function clearSnake() {
  squares[snake.front].className = "gridsquare";
  snake.mid.forEach((snakePart) => {
    squares[snakePart].className = "gridsquare";
  });
}

// ADD RANDOM FOOD
function addFood() {
  if (!foodActive) {
    foodIndex = Math.floor(Math.random() * squares.length);
    if (!snake.mid.includes(foodIndex) && snake.front !== foodIndex) {
      randomFoodNum = Math.floor(Math.random() * 5);
      squares[foodIndex].classList.add(`food${randomFoodNum}`);
      foodActive = true;
    } else {
        addFood();
    };
  };
};

// ADD LENGTH TO SNAKE
function growSnake() {
  snake.mid.unshift(snake.mid[0] - 1);
  if (gameSpeed > 60) gameSpeed -= 20;
  clearInterval(gameStart);
  gameStart = setInterval(movementTick, gameSpeed);
  score += 10;
  scorePara.innerText = `Current score: ${score}`;
};

// PLAY AGAIN BUTTON
function playAgain () {
  score = 0;
  foodActive = false;
  gameSpeed = 500;
  direction = "up";
  inputGiven = false;
  gridShift = -20;
  gameStart = 0;
  foodIndex = 0;
  randomFoodNum = 0;
  scorePara.innerText = `Current score: ${score}`;
  gameGrid.classList.remove("lose_screen");
  gameGrid.classList.add("pause_screen");
    squares.forEach((square) => {
        square.className = "gridsquare"
    });
    snake.front = 189;
    snake.mid = [187, 188];
    snakeDesign();
    gameBody[0].removeChild(playAgainButton);
};