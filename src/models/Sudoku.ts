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

// add type for generate modes
export type GenerateMode = 'easy' | 'medium' | 'hard';

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
        const sudoku = new Sudoku(this.board);
        sudoku.lastActions = this.lastActions.map(action => [...action]);
        return sudoku;
    }

    public getRow(row: number): number[] {
        return this.board[row];
    }

    public getColumn(col: number): number[] {
        return this.board.map(row => row[col]);
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
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }

        return true;
    }

    public getHint():number[]|undefined {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidMove(i, j, num)) {
                            console.log(i, j, num)
                            const newSudoku = this.copy();
                            newSudoku.setCell(i, j, num);
                            if (newSudoku.solve()) {
                                return [i, j, num];
                            }
                        }
                    }
                }
            }
        }
        return undefined
    }

    public solve(): boolean {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValidMove(i, j, num)) {
                            this.setCell(i, j, num);

                            if (this.solve()) {
                                return true;
                            }

                            this.undo();
                        }
                    }

                    return false;
                }
            }
        }

        return this.isSolved();
    }

    generate(mode: GenerateMode = 'easy') {
        throw new Error('Not implemented');
    }
}