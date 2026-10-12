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

    if (Math.abs(rowDiff) > 1 || Math.abs(colDiff) > 1) {
        return false;
    }

    return !(attack && sameColor(piece,targetPiece));
    
}

function checkWhite(piece) {
    return piece === piece.toUpperCase();
}

function sameColor(piece,targetPiece) {
    const isWhite = checkWhite(piece);
    const isTargetWhite = checkWhite(targetPiece);

    return isWhite === isTargetWhite;
}

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

const boardElement = document.getElementById('board');

renderBoard();

const whiteTurn = true;

function updateTurn() {
    whiteTurn = !whiteTurn;
}

let selectedSquare = null;

boardElement.addEventListener('click', (event) => {
    const squareElement = event.target.closest('.square');
    if (!squareElement) return;

    const row = parseInt(squareElement.dataset.row);
    const col = parseInt(squareElement.dataset.col);
    const clickedPiece = initialBoard[row][col];

    if (!selectedSquare) {
        if (clickedPiece !== null) {
            if (checkWhite(clickedPiece) === false) {
                return;
            }
            selectedSquare = {row,col};

            squareElement.classList.add('selected');
        }
        return;
    }

    const startRow = selectedSquare.row;
    const startCol = selectedSquare.col;

    if (startRow === row && startCol == col) {
        clearSelection();
        return;
    }
    
    const piece = initialBoard[startRow][startCol];

    let isValid = false;
    
    if (piece.toUpperCase() === 'N') {
        isValid = isValidKnightMove(startRow,startCol,row,col);
    } else if (piece.toUpperCase() === 'P') {
        isValid = isValidPawnMove(startRow,startCol,row,col);
    } else if (piece.toUpperCase() === 'R') {
        isValid = isValidRookMove(startRow,startCol,row,col);
    } else if (piece.toUpperCase() === 'B') {
        isValid = isValidBishopMove(startRow,startCol,row,col);
    } else if (piece.toUpperCase() === 'Q') {
        isValid = isValidQueenMove(startRow,startCol,row,col);
    } else if (piece.toUpperCase() === 'K') {
        isValid = isValidKingMove(startRow,startCol,row,col);
    }

    if (!isValid) {
        clearSelection();
        return;
    }

    initialBoard[row][col] = initialBoard[startRow][startCol];
    initialBoard[startRow][startCol] = null;

    
    clearSelection();
    
    updateTurn();
    
    renderBoard();

})

function clearSelection() {
    selectedSquare = null;

    document.querySelectorAll('.square').forEach(sq => sq.classList.remove('selected'));
}

function renderBoard() {
    boardElement.innerHTML = ''

    for (let row=0; row<8; row++) {
        for (let col=0; col<8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');

            const isLight = (row+col)%2 === 0;

            square.classList.add(isLight ? 'light' : 'dark');

            const piece = initialBoard[row][col];
            if (piece) {
                const img = document.createElement('img');
                img.src = pieceImages[piece];
                img.alt = piece;
                img.classList.add('chess-piece');
                square.appendChild(img);
            }

            square.dataset.row = row;
            square.dataset.col = col;

            boardElement.appendChild(square);

        }
    }
}