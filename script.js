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

const boardElement = document.getElementById('board');

renderBoard();

let whiteTurn = true;

function updateTurn() {
    whiteTurn = !whiteTurn;
}

function clearSelection() {
    selectedSquare = null;

    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected');
        sq.classList.remove('valid-move');
        sq.classList.remove('attack-move');
    });
}

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
                square.appendChild(img);
            }

            square.dataset.row = row;
            square.dataset.col = col;

            boardElement.appendChild(square);

        }
    }
}

function highlightValidMoves (startRow,startCol) {
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

let selectedSquare = null;

const body = document.querySelector('body')
const stick = document.querySelector('.stick');

boardElement.addEventListener('click', (event) => {
    const squareElement = event.target.closest('.square');
    if (!squareElement) return;

    const row = parseInt(squareElement.dataset.row);
    const col = parseInt(squareElement.dataset.col);
    const clickedPiece = initialBoard[row][col];

    stick.classList.add('hidden')

    if (!selectedSquare) {
        if (clickedPiece !== null) {
            if (checkWhite(clickedPiece) !== whiteTurn) {
                return;
            }
            selectedSquare = {row,col};

            squareElement.classList.add('selected');

            highlightValidMoves(row,col);

            stick.src = pieceImages[clickedPiece];
            stick.classList.remove('hidden');
            squareElement.classList.add('hidden');
        }

        return;
    }

    const startRow = selectedSquare.row;
    const startCol = selectedSquare.col;

    if (startRow === row && startCol == col) {
        clearSelection();
        squareElement.classList.remove('hidden');
        return;
    }

    if (clickedPiece !== null && checkWhite(clickedPiece) == whiteTurn) {
        clearSelection();
        selectedSquare = {row,col};
        squareElement.classList.add('selected');
        highlightValidMoves(row,col);

        stick.src = pieceImages[clickedPiece];
        stick.classList.remove('hidden');

        return;
    }
    
    const piece = initialBoard[startRow][startCol];

    let isValid = false;

    isValid = isMoveValidForPiece(startRow,startCol,row,col,piece)
    
    if (!isValid) {
        clearSelection();
        return;
    }

    const targetPiece = initialBoard[row][col];
    initialBoard[row][col] = piece;
    initialBoard[startRow][startCol] = null;

    const movingPlayerIsWhite = whiteTurn;
    if (isKingInCheck(movingPlayerIsWhite)) {
        initialBoard[startRow][startCol] = piece;
        initialBoard[row][col] = targetPiece;

        clearSelection();
        return;
        
    }
    
    clearSelection();
    updateTurn();
    renderBoard();

    const nextPlayerIsWhite = whiteTurn;
    if (isCheckmate(nextPlayerIsWhite)) {
        alert(`Checkmate, ${nextPlayerIsWhite ? 'Black' : 'White'} wins!`)
    }

})

window.addEventListener('mousemove', (event) => {
    try{
        stick.style.transform = `translate(calc(${event.clientX}px - 50%),calc(${event.clientY}px - 50%))`
    } catch (e) {
        alert(e)
    }
})