document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));

    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const speedBtn = document.querySelector('#speed-button');

    let nextRandom = 0;
    let timerId = null;
    let score = 0;
    let interval = getInterval();

    const width = 10;

    // The Tetrominoes

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1],
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    // randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // draw the Tetromino
    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove('tetromino');
        });
    }

    // assign functions to keyCodes
    function control(event) {
        switch (event.keyCode) {
            case 37:
                moveLeft();
                break;

            case 38:
                rotate();
                break;

            case 39:
                moveRight();
                break;

            case 40:
                moveDown();
                break;

            default:
                break;
        }
    }

    document.addEventListener('keyup', control);

    // move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // freeze function
    function freeze() {
        if (current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach((index) => squares[currentPosition + index].classList.add('taken'));

            // start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1;

        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }

    // move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) currentPosition += 1;

        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }

        draw();
    }

    // rotate the tetromino
    function rotate() {
        undraw();

        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }

        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    // the Tetrominoes without rotation
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
    ];

    // display the shape in the mini-grid display
    function displayShape() {
        // remove any trace of tetromino from the entire grid
        displaySquares.forEach((squares) => {
            squares.classList.remove('tetromino');
        });
        upNextTetrominoes[nextRandom].forEach((index) => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    function getInterval() {
        if (speedBtn) {
            let value = speedBtn.value;
            let minValue = speedBtn.min;
            let maxValue = speedBtn.max;

            let interval = Math.floor(maxValue - value);

            if (interval < minValue) {
                return minValue;
            }
            return interval;
        } else {
            return 500;
        }
    }

    speedBtn?.addEventListener('change', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;

            draw();
            interval = getInterval();
            timerId = setInterval(moveDown, interval);
        }
    });

    // add functionality to the button
    startBtn?.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            interval = getInterval();
            timerId = setInterval(moveDown, interval);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every((index) => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;

                row.forEach((index) => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                });

                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach((cell) => grid.appendChild(cell));
            }
        }
    }

    //game over
    function gameOver() {
        if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }
});
