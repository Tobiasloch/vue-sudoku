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
            background: cell.valid ? (cell.hint ? 'green' : 'inherit') : 'red',
            padding: 0
          }"
          :readonly="cell.isReadonly || (!sudokuIsValid && cell.valid)"
        >
          <div v-if="cell.value != 0" :style="{fontSize: `${buttonSize}px`}">
            {{ cell.value }}
          </div>
          <v-overlay
            v-model="cell.overlay"
            activator="parent"
            location-strategy="connected"
            location="center"
          >
            <NumpadComponent 
              @update:modelValue="(newValue:number) => {setBoardValue(cell, newValue)}"
              :fontsize="buttonSize"
            >
            </NumpadComponent>
          </v-overlay>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel, Ref, ref, watch, defineEmits, defineExpose } from 'vue';
import NumpadComponent from './NumpadComponent.vue';
import Sudoku from '@/models/Sudoku';

class SudokuCell {
  sudoku:Sudoku
  rowIndex: number
  colIndex: number
  overlay: boolean = false
  valid: boolean = true
  hint: boolean = false

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
    emit('update:modelValue', reactiveModel.value)
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
const emit = defineEmits(['update:modelValue'])
const model = defineModel<Sudoku>({
  default: new Sudoku(),
  type: Sudoku,
})

const reactiveModel = ref(model)

let cells:Ref<SudokuCell[][]> = ref([])

watch(() => reactiveModel.value,
  () => {
    cells.value = reactiveModel.value.board.map((row, rowIndex) => {
      return row.map((num, colIndex) => {
        return new SudokuCell(reactiveModel.value, rowIndex, colIndex)
      })
    })
    updateInValid()
  },
  { immediate: true }
)

function setBoardValue(cell:SudokuCell, value:number) {
  cell.overlay = false
  if (cell.value == value) {
    return
  }

  cell.value = value
  updateInValid()
}

function showHint() {
  let rowIndex: number|undefined = undefined
  let colIndex: number|undefined = undefined;
  cells.value.forEach(row => {
    row.forEach(cell => {
      if (!cell.valid) {
        cell.value = cell.initialValue;
        colIndex = cell.colIndex;
        rowIndex = cell.rowIndex;
      }
    })
  })

  const hint = reactiveModel.value.getHint(rowIndex, colIndex)
  if (hint) {
    resetCells();
    const [row, col, value] = hint
    cells.value[row][col].hint = true
    cells.value[row][col].value = value
  }
}

function undo() {
  reactiveModel.value.undo()
  resetCells()
  updateInValid()
}

function resetCells(resetValid:boolean = true, resetHint:boolean = true) {
  for (let row of cells.value) {
    for (let cell of row) {
      if (resetValid) cell.valid = true
      if (resetHint) cell.hint = false
    }
  }
}

function updateInValid() {
  const conflicts = reactiveModel.value.conflictingCells()

  resetCells(true, false)
  for (let [rowIndex,colIndex] of conflicts) {
    cells.value[rowIndex][colIndex].valid = false
  }
}

defineExpose({
  undo, showHint
})

const sudokuIsValid = computed(() => {
  return reactiveModel.value.isValid()
})

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