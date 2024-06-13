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
                        <v-btn icon @click="sudokuGeneratorDialog = true" v-bind="props">
                            <v-icon>mdi-shuffle</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Undo" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn icon @click="sudokuComponent.undo()" v-bind="props">
                            <v-icon>mdi-undo</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Hint" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn icon @click="sudokuComponent.showHint()" v-bind="props">
                            <v-icon>mdi-lightbulb</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>

                <v-tooltip text="Solve" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn icon @click="areYouSureObject = areYouSureItems[2]; areYouSureDialog = true" v-bind="props">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Clear" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn icon @click="areYouSureObject = areYouSureItems[1]; areYouSureDialog = true" v-bind="props">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip text="Reset" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn icon @click="areYouSureObject = areYouSureItems[0]; areYouSureDialog = true" v-bind="props">
                            <v-icon>mdi-reload</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>

                <v-dialog v-model="areYouSureDialog" max-width="400">
                    <v-card :prepend-icon="areYouSureObject.icon" :text="areYouSureObject.text" :title="areYouSureObject.title">
                        <template v-slot:actions>
                            <v-spacer></v-spacer>

                            <v-btn @click="areYouSureDialog = false">
                                No
                            </v-btn>

                            <v-btn color="primary" @click="areYouSureDialog = false; areYouSureObject.action()">
                                Yes
                            </v-btn>
                        </template>
                    </v-card>
                </v-dialog>

                <v-dialog 
                    v-model="sudokuGeneratorDialog" 
                    max-width="600"
                    :persistent="generatorIterations > 0 || sudoku.emptyCells().length >= 9*9"
                >
                    <v-card 
                        :loading="generatorIterations > 0" 
                        prepend-icon="mdi-shuffle" 
                        title="Generate new sudoku?"
                    >
                        <template v-slot:loader="{ isActive }">
                            <v-progress-linear
                                :active="isActive"
                                height="20"
                                :max="sudokuDifficulty"
                                :model-value="generatorIterations"
                                :color="selectedDifficulty().color"
                            ><strong>{{ generatorIterations }}</strong></v-progress-linear>
                        </template>
                        <v-card-text>
                            Select the difficulty of the sudoku to generate. The higher the number, the more fields will
                            be filled in
                            for you.

                            <v-radio-group 
                                :inline="windowWidth > 600"
                                v-model="selectedOption" 
                                center-affix 
                                @update:model-value="sudokuDifficulty = selectedOption"
                            >
                                <v-radio 
                                    v-for="option in difficultyOptions" 
                                    :key="option.value" 
                                    :label="option.label"
                                    :value="option.value"
                                    :color="selectedDifficulty().color"
                                ></v-radio>
                            </v-radio-group>

                            <v-slider 
                                @update:model-value="updatedDifficulty" 
                                :model-value="sudokuDifficulty"
                                :max="60" 
                                :min="1"
                                :step="1" 
                                class="align-center"
                                hide-details
                                thumb-label="always"
                                :color="selectedDifficulty().color"
                            >
                            </v-slider>
                        </v-card-text>
                        <template v-slot:actions>
                            <v-spacer></v-spacer>

                            <v-btn @click="sudokuGeneratorDialog = false;">
                                Cancel
                            </v-btn>

                            <v-btn color="primary" @click="generate();">
                                Generate
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
let sudoku = ref(new Sudoku())
let generatedSudoku = sudoku.value.copy();

const areYouSureItems = ref([
    { title:'Reset', text: 'Are you sure you want to reset the state of the sudoku to the generated one?', icon: 'mdi-reload', action: () => {
        sudoku.value = generatedSudoku.copy();
    }},
    { title:'Clear', text: 'Are you sure you want to clear the sudoku, such that all fields are empty?', icon: 'mdi-delete', action: () => {
        sudoku.value = new Sudoku();
    }},
    { title:'Solve', text: 'Are you sure you want to run the solver to completely solve the sudoku for you?', icon: 'mdi-check', action: () => {
        solveSudoku()
    } },
]);

let areYouSureDialog = ref(false);
let areYouSureObject = ref(null);

const difficultyOptions = ref([
    { label: "Easy", value: 35, color: "green-darken-1" },
    { label: "Medium", value: 42, color: "orange-darken-1" },
    { label: "Hard", value: 49, color: "red-darken-1" }
])
let selectedOption = ref(difficultyOptions.value[0].value);
function selectedDifficulty() {
    return difficultyOptions.value.find(option => option.value === selectedOption.value)
}

let sudokuDifficulty = ref(selectedOption.value);
let generatorIterations = ref(0);

function updatedDifficulty(newValue) {
    let dist = Number.POSITIVE_INFINITY
    sudokuDifficulty.value = newValue
    for (let option of difficultyOptions.value) {
        let newDist = Math.abs(option.value - sudokuDifficulty.value)
        if (newDist < dist) {
            dist = newDist
            selectedOption.value = option.value
        }
    }
}

let sudokuGeneratorDialog = ref(true);

async function iterateGenerator() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 0)
    }).then(() => {
        if (generatorIterations.value < sudokuDifficulty.value && sudokuGeneratorDialog.value) {
            if (generatedSudoku.clearCell(true, true)) {
                generatorIterations.value++
            } else {
                generatorIterations.value = sudokuDifficulty.value
            }

            iterateGenerator()
        } else {
            sudoku.value = generatedSudoku.copy()
            sudokuGeneratorDialog.value = false
            generatorIterations.value = 0
        }
    })
} 

function solveSudoku() {
    const solvedSudoku = generatedSudoku.copy()
    solvedSudoku.solve()
    sudoku.value = solvedSudoku
}

function generate() {
    generatedSudoku = new Sudoku();
    generatedSudoku.solve(true)

    iterateGenerator()
}

let windowWidth = ref(window.innerWidth || 0);
window.addEventListener('resize', () => {
    this.windowWidth.value = window.innerWidth || 0;
    });

</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.card-actions {
    justify-content: center;
}

:deep(.v-input__control) {
    align-items: center;
}

@media (max-width: 600px) {
    :deep(.v-input__control) {
        align-items: start;
    }
}
    
:deep(.v-selection-control-group ) {
    column-gap: 35px;

}


</style>