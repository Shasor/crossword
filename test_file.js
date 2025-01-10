var puzzle = '2001\n0..0\n1000\n0..0'
var words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(puzzle, words)

puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
words = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
]
crosswordSolver(puzzle, words)

puzzle = `..1.1..1...
10000..1000
..0.0..0...
..1000000..
..0.0..0...
1000..10000
..0.1..0...
....0..0...
..100000...
....0..0...
....0......`
words = [
  'popcorn',
  'fruit',
  'flour',
  'chicken',
  'eggs',
  'vegetables',
  'pasta',
  'pork',
  'steak',
  'cheese',
]
crosswordSolver(puzzle, words)

 puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
 words = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse()

crosswordSolver(puzzle, words)

console.log("Test mismatch between number of input words and puzzle starting cells");
 puzzle = '2001\n0..0\n2000\n0..0'
 words = ['casa', 'alan', 'ciao', 'anta']
crosswordSolver(puzzle, words)

console.log(" Test starting words higher than 2");
 puzzle = '0001\n0..0\n3000\n0..0'
 words = ['casa', 'alan', 'ciao', 'anta']
crosswordSolver(puzzle, words)

console.log(" Test words repetition")
 puzzle = '2001\n0..0\n1000\n0..0'
 words = ['casa', 'casa', 'ciao', 'anta']
crosswordSolver(puzzle, words)

console.log(" Test empty puzzle")
 puzzle = ''
 words = ['casa', 'alan', 'ciao', 'anta']
crosswordSolver(puzzle, words)

console.log(" Test wrong format checks")
 puzzle = 123
 words = ['casa', 'alan', 'ciao', 'anta']
crosswordSolver(puzzle, words)

console.log(" Test wrong format checks")
 puzzle = ''
 words = 123
crosswordSolver(puzzle, words)

console.log(" Test multiple solutions")
 puzzle = '2000\n0...\n0...\n0...'
 words = ['abba', 'assa']
crosswordSolver(puzzle, words)

console.log(" Test no solution")
 puzzle = '2001\n0..0\n1000\n0..0'
 words = ['aaab', 'aaac', 'aaad', 'aaae']
crosswordSolver(puzzle, words)
