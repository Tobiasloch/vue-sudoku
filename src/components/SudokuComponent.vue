<template>
  <div class="sudoku-container">
    <div v-for="(row, rowIndex) in cells" :key="rowIndex" class="sudoku-row">
      <div v-for="(cell, colIndex) in row" :key="colIndex" class="sudoku-cell">
        <v-btn 
          class="sudoku-input" 
          variant="text"
          block
          height="100%"
        >
          {{ cell.value }}
          <v-overlay
            v-model="cell.overlay"
            activator="parent"
            location-strategy="connected"
            location="center"
            min-width="300%"
          >
            <NumpadComponent 
              v-model="cell.value" 
              @update:modelValue="cell.overlay = false"
            >
            </NumpadComponent>
          </v-overlay>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NumpadComponent from './NumpadComponent.vue';


class SudokuCell {
  value = 0
  overlay = false
}

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

const cells = ref(sudokuGrid.value.map(row => row.map(cell => new SudokuCell(cell))))

</script>

<style scoped>
.sudoku-cell {
  padding: 0;
  flex: 1;
  border: 1px solid #ccc;
}

.sudoku-cell:nth-child(3n) {
  border-right: 2px solid #000;
}

.sudoku-cell:nth-child(1) {
  border-left: 2px solid #000;
}

.sudoku-row:nth-child(3n) {
  border-bottom: 2px solid #000;
}

.sudoku-row:nth-child(1) {
  border-top: 2px solid #000;
}

.sudoku-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Adjust as needed */
  aspect-ratio: 1/1;
}

.sudoku-row {
  flex: 1;
  display: flex;
}

.sudoku-input {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 100%;
}

</style>