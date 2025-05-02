let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";
let pipes = [];
let frame = 0;

const flapSound = new Audio("url for flap.mp3");
const scoreSound = new Audio("score soound.mp3");
const collideSound = new Audio("collide sound.mp3");

const backgroundMusic = new Audio("backgroundmusic.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.play();

if (localStorage.getItem("easyHighScore") == null) {
  localStorage.setItem("easyHighScore", 0);
}
if (localStorage.getItem("mediumHighScore") == null) {
  localStorage.setItem("mediumHighScore", 0);
}
if (localStorage.getItem("hardHighScore") == null) {
  localStorage.setItem("hardHighScore", 0);
}
if (localStorage.getItem("insaneHighScore") == null) {
  localStorage.setItem("insaneHighScore", 0);
}

let easyHighScore = localStorage.getItem("easyHighScore");
let mediumHighScore = localStorage.getItem("mediumHighScore");
let hardHighScore = localStorage.getItem("hardHighScore");
let insaneHighScore = localStorage.getItem("insaneHighScore");

let gameInterval = null;

let pipe_gap = 400;
let frame_time = 150;
let pipeSpeed = 3;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_button = document.getElementById("start_button");
let difficulty_select = document.getElementById("difficulty-select");

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    const selected = difficulty_select.value;
    if (game_state !== "PlayEasy" && selected == "easy") {
      game_state = "PlayEasy";
      startGame();
    } else if (game_state !== "PlayMedium" && selected === "medium") {
      game_state = "PlayMedium";
      startGame();
    } else if (game_state !== "PlayHard" && selected === "hard") {
      game_state = "PlayHard";
      startGame();
    } else if (game_state !== "PlayInsane" && selected === "insane") {
      game_state = "PlayInsane";
      startGame();
    }
    flapSound.play();
    bird_dy = -7;
  }
});

if (game_state == "Start") {
  // always update high score while inactive
  setInterval(() => {
    const selected = difficulty_select.value;
    easyHighScore = localStorage.getItem("easyHighScore");
    if (selected == "easy") {
      score_display.textContent = "Score: " + score + " | Best: " + easyHighScore;
    }
    mediumHighScore = localStorage.getItem("mediumHighScore");
    if (selected == "medium") {
      score_display.textContent = "Score: " + score + " | Best: " + mediumHighScore;
    }
    hardHighScore = localStorage.getItem("hardHighScore");
    if (selected == "hard") {
      score_display.textContent = "Score: " + score + " | Best: " + hardHighScore;
    }
    insaneHighScore = localStorage.getItem("insaneHighScore");
    if (selected == "insane") {
      score_display.textContent = "Score: " + score + " | Best: " + insaneHighScore;
    }
  }, 10);
}

function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;
  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);
  bird.style.top = birdTop + "px";
}

function startGame() {
  if (gameInterval !== null) return;

  backgroundMusic.play();
  start_button.style.visibility = "hidden";
  difficulty_select.style.visibility = "hidden";
  reset_high.style.visibility = "hidden";
  if (game_state === "PlayEasy") {
    easyHighScore = localStorage.getItem("easyHighScore");
    score_display.textContent = "Score: " + score + " | Best: " + easyHighScore;
  } else if (game_state === "PlayMedium") {
    mediumHighScore = localStorage.getItem("mediumHighScore");
    score_display.textContent =
      "Score: " + score + " | Best: " + mediumHighScore;
  } else if (game_state === "PlayHard") {
    hardHighScore = localStorage.getItem("hardHighScore");
    score_display.textContent = "Score: " + score + " | Best: " + hardHighScore;
  } else if (game_state === "PlayInsane") {
    insaneHighScore = localStorage.getItem("insaneHighScore");
    score_display.textContent =
      "Score: " + score + " | Best: " + insaneHighScore;
  }

  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();
    getDifficultySettings();
    frame++;
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

function onStartButtonClick() {
  const selected = difficulty_select.value;
  if (game_state !== "PlayEasy" && selected === "easy") {
    game_state = "PlayEasy";
    startGame();
  } else if (game_state !== "PlayMedium" && selected === "medium") {
    game_state = "PlayMedium";
    startGame();
  } else if (game_state !== "PlayHard" && selected === "hard") {
    game_state = "PlayHard";
    startGame();
  } else if (game_state !== "PlayInsane" && selected === "insane") {
    game_state = "PlayInsane";
    startGame();
  }
}

function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;
  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - pipeSpeed + "px";

    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

function setScore(newScore) {
  if (newScore > score) {
    scoreSound.play();
  }
  score = newScore;
  if (game_state === "PlayEasy") {
    score_display.textContent = "Score: " + score + " | Best: " + easyHighScore;
  } else if (game_state === "PlayMedium") {
    score_display.textContent =
      "Score: " + score + " | Best: " + mediumHighScore;
  } else if (game_state === "PlayHard") {
    score_display.textContent = "Score: " + score + " | Best: " + hardHighScore;
  } else if (game_state === "PlayInsane") {
    score_display.textContent =
      "Score: " + score + " | Best: " + insaneHighScore;
  }
}

function checkCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }
  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

function endGame() {
  if (game_state === "PlayEasy") {
    if (Number(score) > Number(easyHighScore)) {
      localStorage.setItem("easyHighScore", score);
    }
  } else if (game_state === "PlayMedium") {
    if (Number(score) > Number(mediumHighScore)) {
      localStorage.setItem("mediumHighScore", score);
    }
  } else if (game_state === "PlayHard") {
    if (Number(score) > Number(hardHighScore)) {
      localStorage.setItem("hardHighScore", score);
    }
  } else if (game_state === "PlayInsane") {
    if (Number(score) > Number(insaneHighScore)) {
      localStorage.setItem("insaneHighScore", score);
    }
  }

  collideSound.play();
  clearInterval(gameInterval);
  gameInterval = null;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  alert("Game Over! Your score: " + score + "!");
  resetGame();
}

function resetGame() {
  bird.style.top = "50%";
  bird_dy = 0;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  game_state = "Start";
  setScore(0);
  frame = 0;
  const selected = difficulty_select.value;

  if (selected === "easy") {
    easyHighScore = localStorage.getItem("easyHighScore");
    score_display.textContent = "Score: 0 | Best: " + easyHighScore;
  } else if (selected === "medium") {
    mediumHighScore = localStorage.getItem("mediumHighScore");
    score_display.textContent = "Score: 0 | Best: " + mediumHighScore;
  } else if (selected === "hard") {
    hardHighScore = localStorage.getItem("hardHighScore");
    score_display.textContent = "Score: 0 | Best: " + hardHighScore;
  } else if (selected === "insane") {
    insaneHighScore = localStorage.getItem("insaneHighScore");
    score_display.textContent = "Score: 0 | Best: " + insaneHighScore;
  }

  start_button.style.visibility = "visible";
  difficulty_select.style.visibility = "visible";
  reset_high.style.visibility = "visible";
}

function resetHighScore() {
  // reset high score function
  const selected = difficulty_select.value;
  if (selected === "easy") {
    easyHighScore = 0;
    localStorage.setItem("easyHighScore", 0);
  } else if (selected === "medium") {
    mediumHighScore = 0;
    localStorage.setItem("mediumHighScore", 0);
  } else if (selected === "hard") {
    hardHighScore = 0;
    localStorage.setItem("hardHighScore", 0);
  } else if (selected === "insane") {
    insaneHighScore = 0;
    localStorage.setItem("insaneHighScore", 0);
  }
}

function getDifficultySettings() {
  const selected = difficulty_select.value;
  if (selected === "easy") {
    pipeSpeed = 2;
    frame_time = 230;
    pipe_gap = 500;
  } else if (selected === "medium") {
    pipeSpeed = 3;
    frame_time = 150;
    pipe_gap = 400;
  } else if (selected === "hard") {
    pipeSpeed = 5;
    frame_time = 90;
    pipe_gap = 370;
  } else if (selected === "insane") {
    pipeSpeed = 6;
    frame_time = 60;
    pipe_gap = 300;
  }
}
