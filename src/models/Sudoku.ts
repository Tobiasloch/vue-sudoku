import { shuffle } from "./utils";

const emptyBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const sudokuMap = new Map<string, boolean>()

const cachedCellIndices = sudokuCellIndices(false)
export function sudokuCellIndices(cache:boolean=true) : number[][] {
    if (cache) return cachedCellIndices.map(cell => [...cell])

    const cellIndices = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cellIndices.push([i, j]);
        }
    }
    return cellIndices;
}

export default class Sudoku {
    public board: number[][];
    private lastActions: number[][] = [];

    constructor(board: number[][] = emptyBoard) {
        this.board = board.map(row => [...row]);
        if (!this.isValid()) {
            throw new Error('Invalid board');
        }
    }

    public hashString(): string {
        return this.board.map(row => row.join('')).join('');
    }

    public copy(): Sudoku {
        // copy should not throw an error when invalid board
        const sudoku = new Sudoku();
        sudoku.board = this.board.map(row => [...row]);
        sudoku.lastActions = this.lastActions.map(action => [...action]);
        return sudoku;
    }

    public setCell(row: number, col: number, value: number): void {
        this.lastActions.push([row, col, this.board[row][col]]);
        this.board[row][col] = value;
    }

    public undo(): void {
        const lastAction = this.lastActions.pop();
        if (lastAction) {
            const [row, col, value] = lastAction;
            this.board[row][col] = value;
        }
    }

    public getRow(row: number): number[] {
        return [...this.board[row]];
    }

    public getColumn(col: number): number[] {
        return [...this.board.map(row => row[col])];
    }

    public getBox(row: number, col: number): number[] {
        const box = [];
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                box.push(this.board[i][j]);
            }
        }

        return box;
    }

    public conflictingCells(): number[][] {
        const conflicts = []

        for (const [i, j] of sudokuCellIndices()) {
            const value = this.board[i][j]
            if (value === 0) continue;

            if (!this.isValidMove(i, j, value)) {
                conflicts.push([i,j])
            }
        }

        return conflicts
    }

    public isValid(): boolean {
        if (this.board.length !== 9) {
            return false;
        }
        for (const [i,j] of sudokuCellIndices()) {
            // invalid size or invalid value in the cell
            if (this.board[i].length !== 9 || this.board[i][j] < 0 || this.board[i][j] > 9) {
                return false;
            }
        }

        return this.conflictingCells().length === 0;
    }

    public isValidMove(row: number, col: number, num: number): boolean {
        // removing the number from the row, column and box and checking if the number is not present
        const rowValues = this.getRow(row);
        rowValues.splice(col, 1);
        const colValues = this.getColumn(col);
        colValues.splice(row, 1);
        const boxValues = this.getBox(row, col);
        boxValues.splice(boxValues.indexOf(num), 1);

        return !rowValues.includes(num) && !colValues.includes(num) && !boxValues.includes(num);
    }

    public isSolved(): boolean {
        return this.emptyCells().length === 0;
    }

    public emptyCells(): number[][] {
        const emptyCells = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push([i, j]);
                }
            }
        }

        return emptyCells;
    }

    public possibleMoves(): number[][][] {
        const possibleMoves = [];
        const emptyCells = this.emptyCells();

        for (const [i, j] of emptyCells) {
            if (this.board[i][j] === 0) {
                const moves = [];
                for (let num = 1; num <= 9; num++) {
                    if (this.isValidMove(i, j, num)) {
                        moves.push(num);
                    }
                }
                possibleMoves.push([[i, j], moves]);
            } else {
                possibleMoves.push([[i,j],[this.board[i][j]]]);
            }
        }
        possibleMoves.sort((a, b) => a[1].length - b[1].length);
        return possibleMoves;
    }


    public getHint(row?: number|undefined, col?: number|undefined):number[]|undefined {
        if (!this.isValid()) return undefined
        
        if (row === undefined || col === undefined) {
            const possibleMoves = this.possibleMoves();
            if (possibleMoves.length === 0) return undefined
    
            row = possibleMoves[0][0][0];
            col = possibleMoves[0][0][1];
        }
        const newSudoku = this.copy();
        if (newSudoku.solve()) {
            return [row, col, newSudoku.board[row][col]]
        }

        return undefined
    }

    public hasUniqueSolution(): boolean {
        const possibleMoves = this.possibleMoves();

        let solutionFound = false;
        for (const [[i,j], moves] of possibleMoves) {
            let solutions = 0;
            for (const num of moves) {
                const newSudoku = this.copy();
                newSudoku.setCell(i, j, num);
                if (newSudoku.solve(false, true)) {
                    solutions++;
                    solutionFound = true;

                    if (solutions > 1) {
                        return false;
                    }
                }
            }
        }
        return solutionFound
    }

    public solve(randomise: boolean=false, caching:boolean=false): boolean {
        const hash = this.hashString()
        const cachedResult = sudokuMap.get(hash)
        if (cachedResult === false || (caching && cachedResult === true)) {
            return cachedResult
        }

        if (!this.isValid()) {
            sudokuMap.set(hash, false)
            return false
        }

        const possibleMoves = this.possibleMoves();

        if (possibleMoves.length === 0) {
            const solved = this.isSolved()
            sudokuMap.set(hash, solved)
            return solved
        }

        const [[i,j], moves] = possibleMoves[0]
        if (randomise) shuffle(moves);
        
        for (const num of moves) {
            this.setCell(i, j, num);

            if (this.solve(randomise, caching)) {
                sudokuMap.set(hash, true)
                return true;
            }

            this.undo();
        }

        sudokuMap.set(hash, false)
        return false;
    }

    public clearCell(randomise:boolean = true, maintainUniqueness: boolean = true): boolean {
        const cellIndices = sudokuCellIndices();
        if (randomise) shuffle(cellIndices);

        for (const [i, j] of cellIndices) {
            const value = this.board[i][j];
            if (value === 0) continue;

            this.board[i][j] = 0;
            if (maintainUniqueness && this.hasUniqueSolution()) {
                return true;
            }
            this.board[i][j] = value;
        }

        return false;
    }

    public generate(emptyCells:number = 6) {
        this.board = emptyBoard.map(row => [...row]);

        this.solve(true);

        for (let i = 0; i < emptyCells; i++) {
            this.clearCell(true, true);
        }
    }
}