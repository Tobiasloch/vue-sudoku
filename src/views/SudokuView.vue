<template>
    <div class="container">
        <v-card min-width="500px" min-height="500px">
            <v-card-title>
                Sudoku
            </v-card-title>
            <v-card-text>
                <SudokuComponent v-model="sudoku" />
            </v-card-text>

            <v-card-actions>
                <v-btn
                    icon
                    @click="sudoku.undo()"
                ><v-icon>mdi-undo</v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import Sudoku from '@/models/Sudoku';
import SudokuComponent from '../components/SudokuComponent.vue';
import { ref } from 'vue';

const sudoku = ref(new Sudoku([
  [0, 3, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
]))

</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>