<template>
  <div ref="sudokuContainer" class="sudoku-container">
    <div v-for="(row, rowIndex) in cells" :key="rowIndex" class="sudoku-row">
      <div v-for="(cell, colIndex) in row" :key="`${rowIndex}:${colIndex}`" class="sudoku-cell">
        <v-btn 
          class="sudoku-input" 
          variant="text"
          block
          height="100%"
          :style="{
            background: cell.valid ? 'inherit' : 'red',
            fontSize: `${buttonSize}px`
          }"
          :readonly="cell.isReadonly"
        >
          <div v-if="cell.value != 0">
            {{ cell.value }}
          </div>
          <v-overlay
            v-model="cell.overlay"
            activator="parent"
            location-strategy="connected"
            location="center"
            min-width="300%"
          >
            <NumpadComponent 
              @update:modelValue="(newValue:number) => {setBoardValue(cell, newValue)}"
            >
            </NumpadComponent>
          </v-overlay>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel, Ref, ref, watch } from 'vue';
import NumpadComponent from './NumpadComponent.vue';
import Sudoku from '@/models/Sudoku';

class SudokuCell {
  sudoku:Sudoku
  rowIndex: number
  colIndex: number
  overlay: boolean = false
  valid: boolean = true

  initialValue: number

  constructor(sudoku:Sudoku, rowIndex:number, colIndex:number) {
    this.sudoku = sudoku
    this.rowIndex = rowIndex
    this.colIndex = colIndex
    this.initialValue = this.value
  }

  get isReadonly() {
    return this.initialValue != 0
  }

  get value() {
    return this.sudoku.board[this.rowIndex][this.colIndex]
  }
  set value(value) {
    this.valid = this.sudoku.isValidMove(this.rowIndex, this.colIndex, value)
    this.sudoku.setCell(this.rowIndex, this.colIndex, value)
  }

  update(newValue:number) {
    if (!this.sudoku.isValidMove(this.rowIndex, this.colIndex, newValue)) {
      this.valid = false
    } else {
      this.valid = true
    }
    this.value = newValue
    this.overlay = false
  }
}

const model = defineModel<Sudoku>({
  default: new Sudoku(),
  type: Sudoku,
})

const reactiveModel = ref(model)

let cells:Ref<SudokuCell[][]> = ref([])

watch(() => model,
  () => {
    cells.value = reactiveModel.value.board.map((row, rowIndex) => {
      return row.map((num, colIndex) => {
        return new SudokuCell(reactiveModel.value, rowIndex, colIndex)
      })
    })
  },
  { immediate: true }
)

function setBoardValue(cell:SudokuCell, value:number) {
  const isValid = reactiveModel.value.isValid()
  if (isValid || reactiveModel.value.isValidMove(cell.rowIndex, cell.colIndex, value)) {
    cell.value = value
    if (!isValid) {
      for (let row of cells.value) {
        for (let cell of row) {
          cell.valid = true
        }
      }
    }
  }
  cell.overlay = false
}

const sudokuContainer = ref<HTMLDivElement | null>(null)
const buttonSize = computed(() => {
  if (sudokuContainer.value) {
    return sudokuContainer.value.clientWidth / 27
  }
  return 12
})

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
}

</style>