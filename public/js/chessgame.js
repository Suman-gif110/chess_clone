const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;

const renderBoard = () => {
    const board = chess.board();

    boardElement.innerHTML = "";

    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {

            const squareElement = document.createElement("div");

            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;

            if (square) {

                const pieceElement = document.createElement("div");

                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );

                pieceElement.innerText = getPieceUnicode(square);

                pieceElement.draggable = true;

                pieceElement.addEventListener("dragstart", (e) => {

                    draggedPiece = pieceElement;

                    sourceSquare = {
                        row: rowindex,
                        col: squareindex,
                    };

                    e.dataTransfer.setData("text/plain", "");
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();

                if (draggedPiece) {

                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };

                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });
};

const handleMove = (source, target) => {

    const from = `${String.fromCharCode(97 + source.col)}${8 - source.row}`;

    const to = `${String.fromCharCode(97 + target.col)}${8 - target.row}`;

    const piece = chess.get(from);

    if (!piece) return;

    let move = { from, to };

    if (
        piece.type === "p" &&
        (
            (piece.color === "w" && to[1] === "8") ||
            (piece.color === "b" && to[1] === "1")
        )
    ) {
        move.promotion = "q";
    }

    const result = chess.move(move);

    if (!result) {
        console.log("Illegal move");
        return;
    }

    renderBoard();
};

const getPieceUnicode = (piece) => {

    const unicodePieces = {
        p: "♟",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",
        P: "♙",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔",
    };

    return unicodePieces[piece.type] || "";
};

renderBoard();