<template>
    <div class="container">
        <v-card width="min(80vh,100vw)">
            <v-card-title>
                Sudoku
            </v-card-title>
            <v-card-text>
                <SudokuComponent ref="sudokuComponent" v-model="sudoku" />
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
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
const sudoku = ref(new Sudoku(
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

</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>