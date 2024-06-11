import { createRouter, createWebHistory } from 'vue-router'
import SudokuView from '../views/SudokuView.vue'

const routes = [
  {
    path: '/',
    name: 'sudoku',
    component: SudokuView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
