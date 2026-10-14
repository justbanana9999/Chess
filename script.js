// Board is populated with pieces.

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// Piece data on the tile point to their respective image.

const pieceImages = {
    'P': 'pieces/Pawn White Wood Outline.svg',
    'R': 'pieces/Rook White Wood Outline.svg',
    'N': 'pieces/Knight White Wood Outline.svg',
    'B': 'pieces/Bishop White Wood Outline.svg',
    'Q': 'pieces/Queen White Wood Outline.svg',
    'K': 'pieces/King White Wood Outline.svg',
    'p': 'pieces/Pawn Black Wood Outline.svg',
    'r': 'pieces/Rook Black Wood Outline.svg',
    'n': 'pieces/Knight Black Wood Outline.svg',
    'b': 'pieces/Bishop Black Wood Outline.svg',
    'q': 'pieces/Queen Black Wood Outline.svg',
    'k': 'pieces/King Black Wood Outline.svg',
};

// All isValid xxx Move-functions check if the target tile is reachable by a piece.

function isValidPawnMove(startRow,startCol,targetRow,targetCol) {
    const piece = initialBoard[startRow][startCol];
    const targetPiece = initialBoard[targetRow][targetCol];

    const isWhite = piece === 'P';
    const direction = isWhite ? -1 : 1;
    const startRank = isWhite ? 6 : 1;
    
    const rowDiff = targetRow-startRow;
    const colDiff = targetCol-startCol;


    if (colDiff === 0 && targetPiece === null) {
        if (rowDiff === direction) return true;

        if (startRow === startRank && rowDiff == direction*2) {
            const middleRow = startRow+direction;
            if (initialBoard[middleRow][startCol] === null) {
                return true;
            }
        }
    }

    if (Math.abs(colDiff) === 1 && rowDiff === direction) {
        if (targetPiece !== null) {
            return !sameColor(piece,targetPiece);
        }
    }

    return false;
    
}

function isValidRookMove(startRow,startCol,targetRow,targetCol) {
    const piece = initialBoard[startRow][startCol];
    const targetPiece = initialBoard[targetRow][targetCol];
    const attack = targetPiece !== null;

    if (startRow !== targetRow && startCol !== targetCol) {
        return false
    };

    if (!checkStep(startRow,startCol,targetRow,targetCol)) {
        return false;
    }

    return !(attack && sameColor(piece,targetPiece));
    
}

function isValidKnightMove(startRow,startCol,targetRow,targetCol) {
    const piece = initialBoard[startRow][startCol];
    const targetPiece = initialBoard[targetRow][targetCol];
    const attack = targetPiece !== null;

    const rowDiff = targetRow-startRow;
    const colDiff = targetCol-startCol;

    if (!((Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2) || (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1))) {
        return false;
    }

    return !(attack && sameColor(piece,targetPiece));
    
}

function isValidBishopMove(startRow,startCol,targetRow,targetCol) {
    const piece = initialBoard[startRow][startCol];
    const targetPiece = initialBoard[targetRow][targetCol];
    const attack = targetPiece !== null;

    const rowDiff = targetRow-startRow;
    const colDiff = targetCol-startCol;

    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;

    if (!checkStep(startRow,startCol,targetRow,targetCol)) {
        return false;
    }

    return !(attack && sameColor(piece,targetPiece));
    
}

function isValidQueenMove(startRow,startCol,targetRow,targetCol) {
    return isValidRookMove(startRow,startCol,targetRow,targetCol) || isValidBishopMove(startRow,startCol,targetRow,targetCol);
    
}

function isValidKingMove(startRow,startCol,targetRow,targetCol) {
    const piece = initialBoard[startRow][startCol];
    const targetPiece = initialBoard[targetRow][targetCol];
    const attack = targetPiece !== null;

    const rowDiff = targetRow-startRow;
    const colDiff = targetCol-startCol;

    if (checkWhite(piece)) {

        const right = checkStep(startRow,startCol,7,7)
        const left = checkStep(startRow,startCol,7,0)

    } else {

        const right = checkStep(startRow,startCol,0,7)
        const left = checkStep(startRow,startCol,0,0)

    }



    if (Math.abs(rowDiff) > 1 || Math.abs(colDiff) > 1) {
        return false;
    }

    return !(attack && sameColor(piece,targetPiece));
    
}

// If a piece is white

function checkWhite(piece) {
    return piece === piece.toUpperCase();
}

// If two pieces are the same color

function sameColor(piece,targetPiece) {
    const isWhite = checkWhite(piece);
    const isTargetWhite = checkWhite(targetPiece);

    return isWhite === isTargetWhite;
}

// Moves a piece to a destination tile, tile by tile, and returns false if there are any pieces before arriving. Used by the rook, bishop and queen.

function checkStep(startRow,startCol,targetRow,targetCol) {
    const rowStep = startRow === targetRow ? 0 : (targetRow>startRow ? 1 : -1);
    const colStep = startCol === targetCol ? 0 : (targetCol>startCol ? 1 : -1);

    let currRow = startRow + rowStep;
    let currCol = startCol + colStep;

    while (currRow !== targetRow || currCol !== targetCol) {
        if (initialBoard[currRow][currCol] !== null) {
            return false;
        }
        currRow += rowStep;
        currCol += colStep;
    }

    return true;

}

// Finds the position of the king of black or white.

function findKing(isWhiteKing) {
    const kingChar = isWhiteKing ? 'K' : 'k';
    for (let row=0;row<8;row++) {
        for (let col=0;col<8;col++) {
            if (initialBoard[row][col] === kingChar) {
                return {row,col};
            }
        }
    }

    return null;

}

// Checks the entire board for possible enemy moves, and returns true if any of the moves hit the king tile.

function isKingInCheck(isWhiteKing) {
    const kingPos = findKing(isWhiteKing);
    if (!kingPos) return false;

    for (let row=0;row<8;row++) {
        for (let col=0;col<8;col++) {
            const piece = initialBoard[row][col];
            if (piece === null) continue;

            const pieceIsWhite = checkWhite(piece);
            if (pieceIsWhite !== isWhiteKing) {
                let canAttack = false;
                const upperPiece = piece.toUpperCase();

                if (upperPiece === 'N') canAttack = isValidKnightMove(row,col,kingPos.row,kingPos.col);
                else if (upperPiece === 'P') canAttack = isValidPawnMove(row,col,kingPos.row,kingPos.col);
                else if (upperPiece === 'R') canAttack = isValidRookMove(row,col,kingPos.row,kingPos.col);
                else if (upperPiece === 'B') canAttack = isValidBishopMove(row,col,kingPos.row,kingPos.col);
                else if (upperPiece === 'Q') canAttack = isValidQueenMove(row,col,kingPos.row,kingPos.col);
                else if (upperPiece === 'K') canAttack = isValidKingMove(row,col,kingPos.row,kingPos.col);
                
                if (canAttack) {
                    return true;
                }
            }
        }
    }

    return false;
}

// First iterates through the board for any pieces checking the opposite king's color,
// then iterates again to check if any of the checked king's pieces (including the king) can move to a tile where the king isn't checked anymore.
// If there aren't, then true is returned.

function isCheckmate(isWhitePlayer) {
    if (!isKingInCheck(isWhitePlayer)) {
        return false;
    }

    for (let startRow=0;startRow<8;startRow++) {
        for (let startCol=0;startCol<8;startCol++) {
            const piece = initialBoard[startRow][startCol];

            if (piece === null) continue;

            if (checkWhite(piece) !== isWhitePlayer) continue;

            for (let targetRow=0;targetRow<8;targetRow++) {
                for (let targetCol=0;targetCol<8;targetCol++) {
                    if (startRow === targetRow && startCol === targetCol) continue;

                    if (isMoveValidForPiece(startRow,startCol,targetRow,targetCol,piece)) {
                        const targetPiece = initialBoard[targetRow][targetCol];
                        initialBoard[targetRow][targetCol] = piece;
                        initialBoard[startRow][startCol] = null;

                        const stillInCheck = isKingInCheck(isWhitePlayer);

                        initialBoard[startRow][startCol] = piece;
                        initialBoard[targetRow][targetCol] = targetPiece;

                        if (!stillInCheck) {
                            return false;
                        }
                    }
                }
            
            }
        }
    }

    return true;
}

// COllected function of all isValid xxx Move-functions, that uses each function for its respective piece.

function isMoveValidForPiece(startRow,startCol,targetRow,targetCol,piece) {
    const upperPiece = piece.toUpperCase();
    if (upperPiece === 'N') return isValidKnightMove(startRow,startCol,targetRow,targetCol);
    if (upperPiece === 'P') return isValidPawnMove(startRow,startCol,targetRow,targetCol);
    if (upperPiece === 'R') return isValidRookMove(startRow,startCol,targetRow,targetCol);
    if (upperPiece === 'B') return isValidBishopMove(startRow,startCol,targetRow,targetCol);
    if (upperPiece === 'Q') return isValidQueenMove(startRow,startCol,targetRow,targetCol);
    if (upperPiece === 'K') return isValidKingMove(startRow,startCol,targetRow,targetCol);
    return false;

}

// Gets the board element, for when manipulating and reading its contents is required. 

const boardElement = document.getElementById('board');

// Initial render.

renderBoard();

// White begins.

let whiteTurn = true;

// whiteTurn = true --> whiteTurn = false

function updateTurn() {
    whiteTurn = !whiteTurn;
}

// Removes all tile decorations, for when no piece is grabbed.

function clearSelection() {
    selectedSquare = null;

    document.body.style.cursor = 'default';
    
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected');
        sq.classList.remove('valid-move');
        sq.classList.remove('attack-move');

        const pieceImg = sq.querySelector('.chess-piece');
        if (pieceImg) {
            pieceImg.classList.remove('hidden');
        }
        hideStick();
    });
}

// Updates the board's tiles' decorations and pieces.

function renderBoard() {
    boardElement.innerHTML = ''

    for (let row=0; row<8; row++) {
        for (let col=0; col<8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');

            const piece = initialBoard[row][col];
            if (piece) {
                const img = document.createElement('img');
                img.src = pieceImages[piece];
                img.alt = piece;
                img.classList.add('chess-piece');
                if (piece.toUpperCase() == 'R' || piece.toUpperCase() == 'K') {
                    img.classList.add('unmoved');
                }
                square.appendChild(img);
            }

            square.dataset.row = row;
            square.dataset.col = col;

            boardElement.appendChild(square);

        }
    }
}

// Highlights all valid moves for the grabbed piece.

function highlightValidMoves(startRow,startCol) {
    const piece = initialBoard[startRow][startCol];

    for (let r=0;r<8;r++) {
        for (let c=0;c<8;c++) {
            if (isMoveValidForPiece(startRow,startCol,r,c,piece)) {
                const targetPiece = initialBoard[r][c];
                initialBoard[r][c] = piece;
                initialBoard[startRow][startCol] = null;

                const leavesInCheck = isKingInCheck(checkWhite(piece));

                initialBoard[startRow][startCol] = piece;
                initialBoard[r][c] = targetPiece;

                if (!leavesInCheck) {
                    const squareElement = document.querySelector(`.square[data-row='${r}'][data-col='${c}']`)
                    if (squareElement) {
                        if (initialBoard[r][c] === null) squareElement.classList.add('valid-move');
                        else squareElement.classList.add('attack-move');
                    }
                }

            }
        }
    }
}

// Stick refers to the grabbed piece's image following the mouse, as if the mouse's "grabbing" the piece.

function showStick(clickedPiece) {
    stick.classList.remove('hidden');
    stick.src = pieceImages[clickedPiece];
    shadow.classList.remove('hidden');
    shadow.src = pieceImages[clickedPiece];
    // document.querySelector('.stick').forEach(el => {
    //     el.src = pieceImages[clickedPiece];
    //     el.classList.remove('hidden');
    // })
}

// Temporarily hides the stick element's image (no piece is grabbed).

function hideStick() {
    stick.classList.add('hidden');
    shadow.classList.add('hidden');
    // document.querySelectorAll('.stick').forEach(el => {
    //     el.classList.add('hidden');
    // })
}

let selectedSquare = null;

const body = document.querySelector('body')
const stick = document.querySelector('.stick');
const shadow = document.querySelector('.shadow');

// Listens for a mouse click on the board. Runs every time a click is detected.

boardElement.addEventListener('click', (event) => {
    const squareElement = event.target.closest('.square');
    if (!squareElement) return;

    const row = parseInt(squareElement.dataset.row);
    const col = parseInt(squareElement.dataset.col);
    const clickedPiece = initialBoard[row][col];

    document.body.classList.remove('is-grabbing');

    // If no piece is selected.

    if (!selectedSquare) {

        // If the clicked tile isn't empty

        if (clickedPiece !== null) {

            // Checks if the clicked piece is of the color of the player's turn.
            
            if (checkWhite(clickedPiece) !== whiteTurn) {
                return;
            }
            
            selectedSquare = {row,col};

            squareElement.classList.add('selected');

            highlightValidMoves(row,col);

            stick.src = pieceImages[clickedPiece];
            showStick(clickedPiece);

            document.body.classList.add('is-grabbing');
            
            const pieceImg = squareElement.querySelector('.chess-piece');

            // Temporarily hides the grabbed piece from the board; It's shown as the Stick element instead.

            if (pieceImg) {
                pieceImg.classList.add('hidden');
            }
            
        }

        return;
    }

    const startRow = selectedSquare.row;
    const startCol = selectedSquare.col;

    // Deselect if the same tile is clicked twice.

    if (startRow === row && startCol == col) {
        clearSelection();
        squareElement.classList.remove('hidden');
        return;
    }

    // Deselect if another piece is selected (from the same color).
    
    if (clickedPiece !== null && checkWhite(clickedPiece) == whiteTurn) {
        clearSelection();
        
        // selectedSquare = {row,col};
        // squareElement.classList.add('selected');
        // highlightValidMoves(row,col);

        // stick.src = pieceImages[clickedPiece];
        // showStick(clickedPiece);

        // document.body.classList.add('is-grabbing');

        return;
    }
    
    // From now on, after all previous conditions and eventual returns, if nothing is returned, then the piece must be placed.

    const piece = initialBoard[startRow][startCol];

    let isValid = false;

    // Invalid move deselects the piece and no move is made.

    isValid = isMoveValidForPiece(startRow,startCol,row,col,piece)
    
    if (!isValid) {
        clearSelection();
        return;
    }

    // Temporarily moves the piece to its destination, to look for a check on the player's piece.

    const targetPiece = initialBoard[row][col];
    initialBoard[row][col] = piece;
    initialBoard[startRow][startCol] = null;

    // Reverts the move if the king is in check.

    const movingPlayerIsWhite = whiteTurn;
    if (isKingInCheck(movingPlayerIsWhite)) {
        initialBoard[startRow][startCol] = piece;
        initialBoard[row][col] = targetPiece;

        clearSelection();
        return;
        
    }

    // After the move is made, clear selection, change whose turn is it, and update the board.
    
    clearSelection();
    updateTurn();
    renderBoard();

    // Look for a checkmate.

    const nextPlayerIsWhite = whiteTurn;
    if (isCheckmate(nextPlayerIsWhite)) {
        // alert(`Checkmate, ${nextPlayerIsWhite ? 'Black' : 'White'} wins!`)
        checkmate(!whiteTurn);
    }

})

// Creates a banner declaring the winner.

function checkmate(whiteWinner) {
    try {
        banner(`${whiteWinner ? 'White' : 'Black'} wins`)

    }   catch(e) {
        alert(e)
    }

}

// Creates a banner with custom text.

function banner(text) {
    const b = document.createElement('div');
    b.classList.add('banner');
    b.innerHTML = text
    body.appendChild(b);
}

// Distance to the nearest valid move for the grabbed piece (from the mouse), including the piece's initial tile.

function getNearestValidMove(mouseX,mouseY) {
    const validSquares = document.querySelectorAll('.square.valid-move,.square.attack-move,.selected');

    let nearestSquare = null;
    let minDistance = Infinity;

    validSquares.forEach(square => {
        const rect = square.getBoundingClientRect();

        const squareCenterX = rect.left+rect.width/2
        const squareCenterY = rect.top+rect.height/2

        const distance = Math.hypot(squareCenterX-mouseX,squareCenterY-mouseY);

        if (distance<minDistance) {
            minDistance = distance;
            nearestSquare = square;
        }
    });

    return minDistance;
}

// I don't remember what this is...

// const computedStyle = getComputedStyle(document.documentElement);

// ***

// Updates the grabbed piece's position (sticks to the mouse), and shadow opacity, blur and offset.
// Creates a depth effect, where the piece is closer to the board when approaching a valid tile.

function handleCursorMove() {
    try{
        const boardRect = boardElement.getBoundingClientRect();
        const tileSize = boardRect.width/8;

        let dist = getNearestValidMove(event.clientX,event.clientY);
        if (dist === Infinity) {
            dist = 1
        }
        const blur = Math.max((dist+9*tileSize)/(tileSize)*5-49,1)*tileSize/50;
        shadow.style.filter = `brightness(0) blur(${blur}px)`
        shadow.style.opacity = Math.min((0.4-(dist)/(tileSize*10))+0.1,0.4)
        const offset = Math.max((dist+9*tileSize)/tileSize-9,1)*tileSize/10;
        // const offset = 50;
        stick.style.transform = `translate(calc(${event.clientX}px - 50%),calc(${event.clientY}px - 50%))`
        shadow.style.transform = `translate(calc(${event.clientX}px - 50% + ${offset}px),calc(${event.clientY}px - 50% + ${offset}px))`
    } catch (e) {
        alert(e)
    }
}

// One-liners that listen for a mouse click or movement. Points to handleCursorMove().
// Listens for click, to update the piece and shadow immediately when a piece is grabbed, and not wait for the mouse to move.

window.addEventListener('mousemove',handleCursorMove);
window.addEventListener('click',handleCursorMove);