import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <h1>Sudoku Solver</h1>
    <div class="sudoku-container">
        <table>
            <tbody id="sudoku-grid">
            </tbody>
        </table>
    </div>

    <button id="solve-btn">Solve Puzzle</button>
    <button id="clear-btn">Clear Grid</button>
`;

const gridSize = 9;

document.addEventListener('DOMContentLoaded', () => {
    const solveButton = document.getElementById("solve-btn");
    solveButton?.addEventListener('click', solveSudoku);

    const clearButton = document.getElementById("clear-btn");
    clearButton?.addEventListener('click', clearGrid);

    const sudokuGrid = document.getElementById("sudoku-grid");

    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid?.appendChild(newRow);
    }
});

async function solveSudoku() {
    const clearButton = document.getElementById("clear-btn") as HTMLButtonElement;
    clearButton.disabled = true;
    const sudokuArray : number[][] = [];

    for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId) as HTMLInputElement;
            const cellValue = cell.value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;

            if (sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
            }
        }
    }

    if (solveSudokuHelper(sudokuArray, 0, 0)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId) as HTMLInputElement;

                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col].toString();
                    cell.classList.add("solved");
                    await sleep(20);
                }
            }
        }
    } else {
        alert("No solution exists for the given Sudoku puzzle.");
    }
    clearButton.disabled = false;
}

function solveSudokuHelper(board : number[][], row : number, col : number) : boolean {
    if (col === 9) {
        col = 0;
        row++;
        if (row === 9) {
            return true;
        }
    }

    //skip filled cells
    if (board[row][col] !== 0) {
        return solveSudokuHelper(board, row, col + 1);
    }

    for (let c = 1; c <= 9; c++) {
        if (isValid(board, row, col, c)) {
            board[row][col] = c;

            if (solveSudokuHelper(board, row, col + 1)) {
                return true;
            }

            //BackTrack
            board[row][col] = 0;
        }
    }

    return false;

    function isValid(board : number[][], row : number, col : number, c : number) : boolean {
        //occurs in row
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === c) {
                return false;
            }
            if (board[i][col] === c) {
                return false;
            }
        }

        //check if the given character occurs in the current 3x3 sub-box
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === c) {
                    return false;
                }
            }
        }

        return true;
    }
}

function sleep(ms: number) : Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId) as HTMLInputElement;
            cell.value = "";
            cell.classList.remove("user-input", "solved");
        }
    }
}
