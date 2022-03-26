let activePlayer = 'X'; // used for detecting wins
let selectedSquares = []; // store x's and o's

function placeXorO(squareIndex) {
    // if the square hasn't already been clicked
    if (!selectedSquares.some(element => element.includes(squareIndex))) {
        // create shortcut for the selected square
        let select = document.getElementById(squareIndex);
        if (activePlayer === 'X') {
            // display an X whenever the user selects a square
            select.style.backgroundImage = 'url("images/x.png")';
        }
        else {
            // display an O whenever the AI selects a square
            select.style.backgroundImage = 'url("images/o.png")';
        }
        // add the selection code to the array
        selectedSquares.push(squareIndex + activePlayer);
        // call function to test for win
        checkWinConditions();

        // change turn
        if (activePlayer === 'X') {
            activePlayer = 'O';
        }
        else {
            activePlayer = 'X';
        }

        // play sound effect for placing a mark
        audio('./media/place.mp3');

        if (activePlayer === 'O') {
            // don't let the user take the AI's turn
            disableClick();
            // delay the turn
            setTimeout(function () { computersTurn(); }, 1000)
        }

        // Because of the condition at the beginning of the if statement, this
        // will only return true if the current player selected a valid square.
        return true;
    }
    function computersTurn() {
        let success = false;
        let pickASquare;
        // keep trying until an empty square has been picked aka rejection sampling
        while (!success) {
            pickASquare = String(Math.floor(Math.random() * 9));
            // placeXorO functions as a discriminator for the rejection sampling
            if (placeXorO(pickASquare)) {
                placeXorO(pickASquare);
                // this will break the loop
                // "while(true)" and "break;" could be used instead.
                success = true;
            }
        };
    }
}

// This function parses the selectedSquares array to search for win conditions.
// drawWinLine function is called to draw line if winning condition is met.
function checkWinConditions() {
    if      (arrayIncludes('0X', '1X', '2X')) { drawWinLine(  50, 100, 558, 100 ) }
    else if (arrayIncludes('3X', '4X', '5X')) { drawWinLine(  50, 304, 558, 304 ) }
    else if (arrayIncludes('6X', '7X', '8X')) { drawWinLine(  50, 508, 558, 508 ) }
    else if (arrayIncludes('0X', '3X', '6X')) { drawWinLine( 100,  50, 100, 558 ) }
    else if (arrayIncludes('1X', '4X', '7X')) { drawWinLine( 304,  50, 304, 558 ) }
    else if (arrayIncludes('2X', '5X', '8X')) { drawWinLine( 508,  50, 508, 558 ) }
    else if (arrayIncludes('6X', '4X', '2X')) { drawWinLine( 100, 508, 510,  50 ) }
    else if (arrayIncludes('0X', '4X', '8X')) { drawWinLine( 100, 100, 520, 520 ) }
    else if (arrayIncludes('0O', '1O', '2O')) { drawWinLine(  50, 100, 558, 100 ) }
    else if (arrayIncludes('3O', '4O', '5O')) { drawWinLine(  50, 304, 558, 304 ) }
    else if (arrayIncludes('6O', '7O', '8O')) { drawWinLine(  50, 508, 558, 508 ) }
    else if (arrayIncludes('0O', '3O', '6O')) { drawWinLine( 100,  50, 100, 558 ) }
    else if (arrayIncludes('1O', '4O', '7O')) { drawWinLine( 304,  50, 304, 558 ) }
    else if (arrayIncludes('2O', '5O', '8O')) { drawWinLine( 508,  50, 508, 558 ) }
    else if (arrayIncludes('6O', '4O', '2O')) { drawWinLine( 100, 508, 510,  50 ) }
    else if (arrayIncludes('0O', '4O', '8O')) { drawWinLine( 100, 100, 520, 520 ) }
    // This condition checks for tie. If none of the above conditions register and 9
    // squares are selected the code executes.
    else if (selectedSquares.length >= 9) {
        //This function plays the tie game sound.
        audio('media/tie.mp3');
        // This function sets a 1 second timer before the resetGame is called.
        setTimeout(function () { resetGame(); }, 1000);
    }
    function arrayIncludes(squareA, squareB, squareC) {
        // assign variables based on winning conditions from the above if, else ifs
        const a = selectedSquares.includes(squareA);
        const b = selectedSquares.includes(squareB);
        const c = selectedSquares.includes(squareC);
        // check if all three match the given winning conditions
        if (a === true && b === true && c === true) { return true }
    }
}

function disableClick() {
    // disable cursor actions
    document.body.style.pointerEvents = 'none';
    // wait for the amount of time the AI move takes
    setTimeout(function () { document.body.style.pointerEvents = 'auto'; }, 1000);
}

function audio(audioURL) {
    // create Audio object using the URL
    let audio = new Audio(audioURL);
    // play sound
    audio.play();
}

function drawWinLine(coordX1, coordY1, coordX2, coordY2) {
    // create canvas element shortcut
    const canvas = document.getElementById('win-lines');
    // get rendering/drawing object
    const c = canvas.getContext('2d');
    // start, end, and interpolation variables
    let x1 = coordX1,
        y1 = coordY1,
        x2 = coordX2,
        y2 = coordY2,
        x = x1,
        y = y1;
    function animateLineDrawing() {
        // call animateLineDrawing again when it's time for another frame
        const animationLoop = requestAnimationFrame(animateLineDrawing);
        // make sure everything is blank
        c.clearRect(0, 0, 608, 608);
        // start a stroke
        c.beginPath();
        // select starting position
        c.moveTo(x1, y1);
        // create a line from the starting position to the given point
        c.lineTo(x, y);
        // set the width of the line
        c.lineWidth = 10;
        // make the color green
        c.strokeStyle = '#5c2';
        // draw the line
        c.stroke();

        if (x1 <= x2 && y1 <= y2) {
            // increment line ending for each frame
            if (x < x2) { x += 10; }
            if (y < y2) { y += 10; }
            // stop the next frame from executing the function again once
            // the line has reached the end
            if (x >= x2 && y >= y2) { cancelAnimationFrame(animationLoop); }
        }
        if (x1 <= x2 && y1 >= y2) {
            if (x < x2) { x += 10; }
            if (y > y2) { y -= 10; }
            // changed the y <= y2 to y >= y2 to trigger timely termination
            if (x >= x2 && y >= y2) { cancelAnimationFrame(animationLoop); }
        }
    }
    function clear() {
        // change animation function
        const animationLoop = requestAnimationFrame(clear);
        // clear the line
        c.clearRect(0, 0, 608, 608);
        // cease further execution
        cancelAnimationFrame(animationLoop);
    }
    // prevent the user from doing anything while the line is being drawn
    disableClick();
    // play the sound of victory
    audio('media/winGame.mp3');
    // start drawing the line
    animateLineDrawing();
    // reset is timed so that it happens after disableClick is done
    setTimeout(function () { clear(); resetGame(); }, 1000);
}

function resetGame() {
    for (let i = 0; i < 9; i++) {
        // clear
        let square = document.getElementById(String(i));
        // clear marks
        square.style.backgroundImage = '';
    }
    // clear selection codes
    selectedSquares = [];
}