//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 64;
let birdHeight = 44.35;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg = new Image();
let topPipeImg = new Image();
let bottomPipeImg = new Image();

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 48;
let pipeHeight = 384;
let pipeX = boardWidth;
let pipeY = 0;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    birdImg.src = "./camorocket.png";
    topPipeImg.src = "./toppipe.png";
    bottomPipeImg.src = "./bottompipe.png";

    // Event listeners
    document.addEventListener("keydown", moveBird);
    board.addEventListener("touchstart", moveBird);

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
};

function update() {
    if (gameOver) {
        requestAnimationFrame(update);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Bird physics
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // Pipes
    pipeArray.forEach(pipe => {
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    });

    pipeArray = pipeArray.filter(pipe => pipe.x >= -pipeWidth);

    // Score display
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score.toFixed(0), 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }

    requestAnimationFrame(update);
}

function moveBird(e) {
    if (e.type === "touchstart" || e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        velocityY = -6;
        if (gameOver) {
            restartGame();
        }
    }
}

function restartGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
}
