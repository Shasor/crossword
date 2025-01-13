import { crosswordSolver } from './crosswordSolver.js'
import { puzzles, words } from './test_file.js'

for (let i = 0; i < puzzles.length; i++) {
  crosswordSolver(puzzles[i], words[i])
  console.log('-------------------------------')
}
