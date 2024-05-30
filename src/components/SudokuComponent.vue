<template>
  <v-container>
    <v-row>
      <v-col v-for="(row, rowIndex) in sudokuGrid" :key="rowIndex" cols="12">
        <v-row>
          <v-col v-for="(cell, colIndex) in row" :key="colIndex" cols="1" class="sudoku-cell">
            <v-text-field v-model="sudokuGrid[rowIndex][colIndex]" :readonly="isReadonly(rowIndex, colIndex)"
              class="sudoku-input" type="number" min="1" max="9" hide-details></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// Initialize a sample Sudoku puzzle (0 represents empty cells)
const sudokuGrid = ref([
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
]);

const initialGrid = JSON.parse(JSON.stringify(sudokuGrid.value));

const isReadonly = (rowIndex, colIndex) => {
  return initialGrid[rowIndex][colIndex] !== 0;
};
</script>

<style scoped>
.sudoku-cell {
  padding: 2px;
}

.sudoku-input {
  text-align: center;
}
</style>