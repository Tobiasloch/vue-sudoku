<template>
    <div class="container">
        <v-card width="min(85vh,100vw)">
            <v-card-title>
                Sudoku
            </v-card-title>
            <v-card-text>
                <SudokuComponent ref="sudokuComponent" v-model="sudoku" />
            </v-card-text>

            <v-card-actions class="card-actions">
                <v-tooltip text="Generate" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon
                            @click="generate()"
                            v-bind="props"
                        >
                            <v-icon>mdi-shuffle</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Undo" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon
                            @click="sudokuComponent.undo()"
                            v-bind="props"
                        >
                            <v-icon>mdi-undo</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Hint" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon
                            @click="sudokuComponent.showHint()"
                            v-bind="props"
                        >
                            <v-icon>mdi-lightbulb</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>

                <v-tooltip text="Solve" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon
                            @click="initSolveQuestion()"
                            v-bind="props"
                        >
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Clear" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon
                            @click="initClearQuestion()"
                            v-bind="props"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Reset" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon
                            @click="initResetQuestion()"
                            v-bind="props"
                        >
                            <v-icon>mdi-reload</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>

                <v-dialog
                    v-model="areYouSureDialog"
                    max-width="400"
                >
                    <v-card
                        :prepend-icon="areYouSureIcon"
                        :text="areYouSureText"
                        :title="areYouSureTitle"
                    >
                        <template v-slot:actions>
                            <v-spacer></v-spacer>

                            <v-btn @click="areYouSureDialog = false">
                                No
                            </v-btn>

                            <v-btn @click="areYouSureDialog = false; areYouSureAction()">
                                Yes
                            </v-btn>
                        </template>
                    </v-card>
                </v-dialog>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import Sudoku from '@/models/Sudoku';
import SudokuComponent from '../components/SudokuComponent.vue';
import { ref } from 'vue';

const sudokuComponent = ref(null);

// have a nearly solved sudoku board as initial state with only 5 cells left to solve
const initialState = [
    [0, 2, 5, 7, 6, 3, 8, 4, 9],
    [4, 7, 8, 5, 1, 9, 3, 6, 2],
    [9, 6, 3, 8, 2, 4, 5, 7, 1],
    [6, 5, 1, 9, 4, 2, 7, 3, 8],
    [8, 9, 4, 3, 7, 5, 2, 1, 6],
    [2, 3, 7, 6, 8, 1, 9, 5, 4],
    [7, 1, 9, 2, 3, 6, 4, 8, 5],
    [5, 8, 6, 4, 9, 7, 1, 2, 3],
    [3, 4, 2, 1, 5, 8, 6, 9, 0]
];
let sudoku = ref(new Sudoku(
//     [
//   [0, 3, 0, 0, 0, 0, 0, 0, 0],
//   [6, 0, 0, 1, 9, 5, 0, 0, 0],
//   [0, 9, 8, 0, 0, 0, 0, 6, 0],
//   [8, 0, 0, 0, 6, 0, 0, 0, 3],
//   [4, 0, 0, 8, 0, 3, 0, 0, 1],
//   [7, 0, 0, 0, 2, 0, 0, 0, 6],
//   [0, 6, 0, 0, 0, 0, 2, 8, 0],
//   [0, 0, 0, 4, 1, 9, 0, 0, 5],
//   [0, 0, 0, 0, 8, 0, 0, 7, 9]
// ]
initialState
))
let generatedSudoku = sudoku.value.copy();


function initSolveQuestion() {
    areYouSureText.value = 'Are you sure you want to run the solver to completely solve the sudoku for you?';
    areYouSureTitle.value = 'Solver';
    areYouSureIcon.value = 'mdi-check';
    areYouSureAction.value = () => sudokuComponent.value.solve();
    areYouSureDialog.value = true;
}

function initClearQuestion() {
    areYouSureText.value = 'Are you sure you want to clear the sudoku, such that all fields are empty?';
    areYouSureTitle.value = 'Clear';
    areYouSureIcon.value = 'mdi-delete';
    areYouSureAction.value = () => {
        sudoku.value = new Sudoku();
    };
    areYouSureDialog.value = true;
}

function initResetQuestion() {
    areYouSureText.value = 'Are you sure you want to reset the state of the  sudoku to the generated one?';
    areYouSureTitle.value = 'Reset';
    areYouSureIcon.value = 'mdi-reload';
    areYouSureAction.value = () => {
        sudoku.value = generatedSudoku.copy();
    };
    areYouSureDialog.value = true;
}

let areYouSureDialog = ref(false);
let areYouSureText = ref('');
let areYouSureTitle = ref('');
let areYouSureIcon = ref('');
let areYouSureAction = ref(() => {});

function generate() {
    throw new Error('Not implemented');
}

</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 500px;
    height: 100vh;
}

.card-actions {
    justify-content: center;
}
</style>