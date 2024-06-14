<template>
    <div class="container">
        <v-card width="min(85vh,100vw)">
            <v-card-title>
                Sudoku
            </v-card-title>
            <v-card-text>
                <SudokuComponent @update:model-value="sudokuUpdated()" ref="sudokuComponent" v-model="sudoku" />
            </v-card-text>

            <v-card-actions class="card-actions">
                <v-tooltip 
                    v-for="action in toolbarActions" 
                    :model-value="action.tooltip" 
                    :key="action.tooltiptext" 
                    :text="action.tooltiptext" 
                    location="top"
                >
                    <template v-slot:activator="{ props }">
                        <v-btn icon @click="action.action()" v-bind="props">
                            <v-icon>{{action.icon}}</v-icon>
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
                                height="5"
                                :max="sudokuDifficulty"
                                :model-value="generatorIterations"
                                :color="selectedDifficulty().color"
                            ></v-progress-linear>
                        </template>
                        <v-card-text>
                            Below you can set the difficulty of the generated sudoku. The higher the number, the more fields will need to be filled in by you.

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
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
        >
        {{ snackbar.text }}

        <template v-slot:actions>
            <v-btn
            color="black"
            variant="text"
            @click="snackbar.show = false"
            >
            Close
            </v-btn>
        </template>
        </v-snackbar>
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

const toolbarActions = ref([
    { icon: 'mdi-shuffle', tooltiptext: 'Generate', tooltip:false, action: () => { sudokuGeneratorDialog.value = true }},
    { icon: 'mdi-undo', tooltiptext: 'Undo', tooltip:false, action: () => { sudokuComponent.value.undo() }},
    { icon: 'mdi-lightbulb', tooltiptext: 'Hint', tooltip:false, action: () => { sudokuComponent.value.showHint() } },
    { icon: 'mdi-check', tooltiptext: 'Solve', tooltip:false, action: () => { areYouSureObject.value = areYouSureItems.value[2]; areYouSureDialog.value = true } },
    { icon: 'mdi-delete', tooltiptext: 'Clear', tooltip:false, action: () => { areYouSureObject.value = areYouSureItems.value[1]; areYouSureDialog.value = true } },
    { icon: 'mdi-reload', tooltiptext: 'Reset', tooltip:false, action: () => { areYouSureObject.value = areYouSureItems.value[0]; areYouSureDialog.value = true } },
])

const areYouSureItems = ref([
    { title:'Reset', text: 'Are you sure you want to reset the state of the sudoku to the last generated one?', icon: 'mdi-reload', action: () => {
        sudoku.value = generatedSudoku.copy();
    }},
    { title:'Clear', text: 'Are you sure you want to clear the sudoku, such that all fields are empty?', icon: 'mdi-delete', action: () => {
        generatedSudoku = new Sudoku();
        sudoku.value = generatedSudoku.copy();
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

let snackbar = ref({
    text: '',
    show: false,
    color: 'red-darken-1'
})

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

function sudokuUpdated() {
    if (sudoku.value.isSolved()) {
        snackbar.value.text = 'Congratulations! You have solved the sudoku. Click "Reset" to go back to the generated sudoku.'
        snackbar.value.show = true
        snackbar.value.color = 'green-darken-1'
    }
}

function solveSudoku() {
    const solvedSudoku = sudoku.value.copy()
    if (solvedSudoku.solve()) {
        sudoku.value = solvedSudoku
        snackbar.value.text = 'The sudoku has been solved. Click "Reset" to go back to the generated sudoku.'
        snackbar.value.show = true
        snackbar.value.color = 'green-darken-1'
    } else {
        snackbar.value.text = 'The sudoku is not solvable. Please check your changes or reset the sudoku.'
        snackbar.value.show = true
        snackbar.value.color = 'red-darken-1'
    }
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