var canvas = document.getElementById('snake');
var context = canvas.getContext('2d');
var startButton = document.getElementById('startButton');
var pauseButton = document.getElementById('pauseButton');
var scoreDisplay = document.getElementById('score');
var gameOverMessage = document.getElementById('gameOverMessage');


//Game variables
var grid = 16;
var count = 0;
var isGameRunning = false;
var isGamePaused = false;
var appleCount = 0;


//Snake position
var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    squares: [],
    maxsquares: 3
};


//Apple position
var apple = {
    x: 320,
    y: 320
};


//Random apple positioning
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


//Game loop function
function loop() {
    if (!isGameRunning || isGamePaused) return;

    requestAnimationFrame(loop);

    //speed of snake
    if (++count < 6) return;
    count = 0;

    //clears canvas for new frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    //snake position
    snake.x += snake.dx;
    snake.y += snake.dy;

    //Wrap snake on screen edges without dying
    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.squares.unshift({x: snake.x, y: snake.y});
    if (snake.squares.length > snake.maxsquares) snake.squares.pop();

    //Draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    //Draw snake
    context.fillStyle = 'green';
    snake.squares.forEach(function(square, index) {
        context.fillRect(square.x, square.y, grid - 1, grid - 1);

        //Check if apple is eaten
        if (square.x === apple.x && square.y === apple.y) {
            snake.maxsquares++; //snake size +
            appleCount++; //apple count +
            scoreDisplay.textContent = "Apples Eaten: " + appleCount; // Update display

            //Reposition apple
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        //if the snake bites itself
        for (var i = index + 1; i < snake.squares.length; i++) {
            if (square.x === snake.squares[i].x && square.y === snake.squares[i].y) {
                gameOver(); // Trigger game over
                return;
            }
        }
    });
}


//Keyboard control
document.addEventListener('keydown', function(e) {
    //left arrow 
    if (e.which === 37 || e.which === 65 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }

    //up arrow
    else if (e.which === 38 || e.which === 87 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }

    //right arrow
    else if (e.which === 39 || e.which === 68 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }

    //down arrow
    else if (e.which === 40 || e.which === 83 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});


//Start game
function startGame() {
    isGameRunning = true;
    isGamePaused = false;
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    gameOverMessage.style.display = 'none'; //Hide Game Over message
    appleCount = 0; //Reset apple count
    scoreDisplay.textContent = "Apples Eaten: " + appleCount; //Reset display
    snake.x = 160;
    snake.y = 160;
    snake.squares = [];
    snake.maxsquares = 3;
    snake.dx = grid;
    snake.dy = 0;
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    requestAnimationFrame(loop);
}


//Game over
function gameOver() {
    isGameRunning = false;
    isGamePaused = false;
    startButton.style.display = 'block';
    pauseButton.style.display = 'none';
    gameOverMessage.style.display = 'block'; //Show Game Over message
}


//Pause game
function togglePause() {
    if (!isGameRunning) return; //change nothing

    isGamePaused = !isGamePaused;
    //updates the text
    pauseButton.textContent = isGamePaused ? "RESUME GAME" : "PAUSE GAME";
    if (!isGamePaused) loop(); //Resume game loop
}


//Event listeners for buttons (start/pause)
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);


//Start game
startGame();
