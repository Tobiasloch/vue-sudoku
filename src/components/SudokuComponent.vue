<template>
  <div ref="sudokuContainer" class="sudoku-container">
    <div v-for="(row, rowIndex) in model.value.board" :key="rowIndex" class="sudoku-row">
      <div v-for="(number, colIndex) in row" :key="colIndex" class="sudoku-cell">
        <v-btn 
          class="sudoku-input" 
          variant="text"
          block
          height="100%"
        >
          <div v-if="cell.value != 0">
            {{ number }}
          </div>
          <v-overlay
            v-model="overlayArray[rowIndex][colIndex]"
            activator="parent"
            location-strategy="connected"
            location="center"
            min-width="300%"
          >
            <NumpadComponent 
              v-model="model.value.board[rowIndex][colIndex]"
              @update:modelValue="overlayArray[rowIndex][colIndex] = false"
            >
            </NumpadComponent>
          </v-overlay>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineModel, computed } from 'vue';
import NumpadComponent from './NumpadComponent.vue';
import Sudoku from '../models/Sudoku.ts';

// class SudokuCell {
//   overlay = false
//   x = 0
//   y = 0

//   set value(value) {
//     this.value = value
//     model.value[this.x][this.y] = value
//   }
//   get value() {
//     return model.value[this.x][this.y]
//   }

//   constructor(value, x, y) {
//     this.value = value
//     this.x = x
//     this.y = y
//   }
// }


// Initialize a sample Sudoku puzzle (0 represents empty cells)

const model = defineModel({
  type: Sudoku,
  required: true,
  default: new Sudoku([
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
])
})

const overlayArray = computed(() => {
  return model.value.board.map((row) => {
    return row.map(() => {
      return false
    })
  })
})


// const cells = ref(sudokuGrid.value.map((row, rowIndex) => {
//   return row.map((value, colIndex) => {
//     return new SudokuCell(value, rowIndex, colIndex)
//   })
// }))
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
  font-size: 4vh;
}

</style>