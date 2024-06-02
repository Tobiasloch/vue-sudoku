<template>
    <div class="numpad-container">
      <div v-for="(row, rowIndex) in numbers" :key="rowIndex" class="numpad-row">
        <div v-for="(cell, colIndex) in row" :key="colIndex" class="numpad-cell">
          <v-btn 
            class="numpad-input" 
            variant="text"
            block
            height="100%"
            @click="model = numbers[rowIndex][colIndex]"
          >
            {{ numbers[rowIndex][colIndex] }}
          </v-btn>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, defineModel } from 'vue';

const model = defineModel({
    prop: 'modelValue',
    event: 'update:modelValue'
})

const numbers = ref([
    [1,2,3],
    [4,5,6],
    [7,8,9]
])
</script>

<style scoped>
.numpad-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Adjust as needed */
  aspect-ratio: 1/1;
  background: #ccc;
}

.numpad-row {
  flex: 1;
  display: flex;
}

.numpad-cell {
  padding: 0;
  flex: 1;
  border: 1px solid #ccc;
}

.numpad-input {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>