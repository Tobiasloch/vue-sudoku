<template>
    <div class="container">
        <SudokuComponent v-model="sudoku" />
    </div>
</template>

<script setup>
import Sudoku from '@/models/Sudoku';
import SudokuComponent from '../components/SudokuComponent.vue';

const sudoku = new Sudoku([
  [5, 3, 0, 0, 8, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
])

</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: min(80vh);
}
</style>