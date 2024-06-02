<template>
    <div class="container">
        <SudokuComponent />
    </div>
</template>

<script setup>
import SudokuComponent from '../components/SudokuComponent.vue';

</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: min(80vh);
}
</style>