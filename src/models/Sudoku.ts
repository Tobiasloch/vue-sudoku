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

export function sudokuCellIndices() : number[][] {
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

    public copy(): Sudoku {
        // cooy should not throw an error when invalid board
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
        return this.board[row];
    }

    public getColumn(col: number): number[] {
        return this.board.map(row => row[col]);
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

    public isValid(): boolean {
        if (this.board.length !== 9) {
            return false;
        }
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i].length !== 9) {
                return false;
            }
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] < 0 || this.board[i][j] > 9) {
                    return false;
                }

                const num = this.board[i][j];
                if (num === 0) continue;
                
                this.board[i][j] = 0;
                const isValidMove = this.isValidMove(i, j, num)
                this.board[i][j] = num;

                if (!isValidMove) {
                    return false;
                }
            }
        }

        return true;
    }

    public isValidMove(row: number, col: number, num: number): boolean {
        const rowValues = this.getRow(row);
        const colValues = this.getColumn(col);
        const boxValues = this.getBox(row, col);

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
        return possibleMoves;
    }


    public getHint():number[]|undefined {
        if (!this.isValid()) return undefined
        
        const emptyCells = this.emptyCells();
        if (emptyCells.length === 0) return undefined

        const [i, j] = emptyCells[0]
        const newSudoku = this.copy();
        if (newSudoku.solve()) {
            return [i, j, newSudoku.board[i][j]]
        }

        return undefined
    }

    public solve(randomise: boolean=false): boolean {
        const possibleMoves = this.possibleMoves();
        possibleMoves.sort((a, b) => a[1].length - b[1].length);

        for (const [[i,j], moves] of possibleMoves) {
            if (randomise) shuffle(moves);
            
            for (const num of moves) {
                this.setCell(i, j, num);
    
                if (this.solve()) {
                    return true;
                }
    
                this.undo();
            }

            return false;
        }

        return this.isSolved();
    }

    public generate(emptyCells:number = 6) {
        this.board = emptyBoard.map(row => [...row]);

        this.solve(true);

        const cellIndices = sudokuCellIndices();
        shuffle(cellIndices);

        for (let i = 0; i < emptyCells; i++) {
            const [row, col] = cellIndices[i];
            this.board[row][col] = 0;
        }
    }
}