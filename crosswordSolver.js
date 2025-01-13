/* verbose is used for debugging. a value of 0 only print the result. 1 add detailled error messages
2 add informations about initial parameters.. 3 show the puzzle grid after each iteration in the backtracking algorithm and its manipulations */
const verbose = 1;

// is this char a number that we can use
function is_numeric(c) {
	return /^[0-2]+$/.test(c);
}

// is this the start of a word ?
function is_start(c) {
	return /^[1-2]+$/.test(c);
}

// is the puzzle in parameter correct ?
function puzzleMeetConditions(puzzle) {
	if (verbose >= 2) { console.log(puzzle); };
	if (typeof puzzle !== 'string') {
		if (verbose >= 1) { console.log("this puzzle isn't a string"); };
		return false;
	};
	if (puzzle === '') {
		if (verbose >= 1) { console.log("the puzzle is empty"); };
		return false;
	};
	let puzzleMap = puzzle.split("\n");
	if (puzzleMap.length === 1) {
		if (verbose >= 1) { console.log("this isn't a crossword but a single line"); };
		return false;
	};

	let lineLength = puzzleMap[0].length;
	for (let line = 0; line < puzzleMap.length; line++) {
		if (puzzleMap[line].length !== lineLength) { return false }; // the puzzle isn't a rectangle
		for (let col = 0; col < lineLength; col++) {
			// for each character, check if it's an empty char or a number;
			if (puzzleMap[line][col] !== '.' && !is_numeric(puzzleMap[line][col])) {
				if (verbose >= 1) {
					console.log("this character isn't right " + puzzleMap[line][col]);
					console.log("this character is on position " + line + " and " + col);
				};
				return false;
			};
		};
	};
	return true;
};

// is the words array correct ?
function wordsMeetConditions(words) {
	if (!Array.isArray(words)) {
		if (verbose >= 1) { console.log("words isn't an array"); };
		return false;
	};
	for (let i = 0; i < words.length; i++) {
		if (typeof words[i] != 'string' || (!/^[A-Za-z]+$/.test(words[i]))) {
			if (verbose >= 1) { console.log("this part of the words array isn't a word : " + words[i]); };
			return false;
		};
		words[i] = words[i].toLowerCase();
	};
	const set = new Set(words);
	if (set.size !== words.length) {
		if (verbose >= 1) { console.log("some words are in double in the words array"); };
		return false;
	};
	return true;
};

// is it possible to complete this puzzle ?
function puzzleIsPossible(puzzle, words, coor) {
	let expectedNumberOfWords = 0;
	for (let i = 0; i < puzzle.length; i++) {
		if (is_numeric(puzzle[i])) { expectedNumberOfWords += Number(puzzle[i]); };
	};

	if (expectedNumberOfWords !== words.length || expectedNumberOfWords !== coor.length) {
		if (verbose >= 1) {
			console.log("the number of words we have is different from the number of words we need to complete this puzzle");
			console.log("expected number of words : " + expectedNumberOfWords);
			console.log("number of words in parameter : " + words.length);
			console.log("number of emplacements founds : " + coor.length);
		};
		return false;
	};
	return true;
};

function lenBothDirectionFrom(row, col, grid) {
	let horizontalLen = 0;
	let verticalLen = 0;

	// if we are on the far left; or if we arn't we need to be sure there isn't another word going on horizontally
	if (col === 0 || (col > 0 && grid[row][col - 1] === ".")) {
		// at this point, those words CAN be horizontal, so we need to check on the right of the starting case
		for (let i = col; i < grid[0].length && grid[row][i] !== "."; i++) {
			horizontalLen++;
		};
	};

	if (row === 0 || (row > 0 && grid[row - 1][col] === ".")) {
		for (let i = row; i < grid.length && grid[i][col] !== "."; i++) {
			verticalLen++;
		};
	};
	return [horizontalLen, verticalLen];
};

function getCoords(grid) {
	let coor = [];
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (is_start(grid[i][j])) {
				let [h_len, v_len] = lenBothDirectionFrom(i, j, grid);
				if (h_len >= 2) {
					coor.push({ row: i, col: j, isHorizontal: true, length: h_len });
				};
				if (v_len >= 2) {
					coor.push({ row: i, col: j, isHorizontal: false, length: v_len });
				};
			};
		};
	};
	return coor;
};

function placeWord(word, coordinate, grid, changes) {
	for (let i = 0; i < word.length; i++) {
		let r = coordinate.row + (coordinate.isHorizontal ? 0 : i);
		let c = coordinate.col + (coordinate.isHorizontal ? i : 0);
		changes.push([r, c, grid[r][c]]);
		grid[r][c] = word[i];
	}
}

function removeWord(grid, changes) {
	while (changes.length) {
		let [r, c, char] = changes.pop();
		grid[r][c] = char;
	}
}

function canPlace(word, coordinate, grid) {
	// check if the word is the right size for the spot
	if (word.length !== coordinate.length) { if (verbose >= 3) { console.log("the word can't fit"); }; return false };
	let noWrongChar = true;
	for (let i = 0; i < word.length && noWrongChar; i++) { // here we want to be sure we are not writing over a different letter of another word. 
		let r = coordinate.row;
		let c = coordinate.col;
		if (coordinate.isHorizontal) { c += i; } else { r += i; };
		if (grid[r][c] >= "a" && grid[r][c] <= "z" && word[i] !== grid[r][c]) {
			if (verbose >= 3) console.log("our char : " + word[i] + " and the one in the grid : " + grid[r][c])
			noWrongChar = false;
		};
	};
	if (noWrongChar) {
		return true;
	} else {
		if (verbose >= 3) { console.log("a character doesn't match"); };
	}
	return false;
};

function solve(copiedCoor, copiedGrid, copiedWords) {
	if (verbose >= 3) console.log("\n" + copiedGrid.map((row) => row.join("")).join("\n"))
	if (copiedWords.length === 0) {
		return true;
	}
	// For each coordinates we try to fill with a word
	for (let coor_idx = 0; coor_idx < copiedCoor.length; coor_idx++) {
		const actual_coor = copiedCoor[coor_idx];
		// try to find the correct word
		for (let words_idx = 0; words_idx < copiedWords.length; words_idx++) {
			const word = copiedWords[words_idx];
			if (canPlace(word, actual_coor, copiedGrid)) {
				let changes = [];
				placeWord(word, actual_coor, copiedGrid, changes);
				copiedWords.splice(words_idx, 1);
				copiedCoor.splice(coor_idx, 1);

				if (solve(copiedCoor, copiedGrid, copiedWords)) return true;
				removeWord(copiedGrid, changes);

				copiedWords.splice(words_idx, 0, word);
				copiedCoor.splice(coor_idx, 0, actual_coor);
			} else {
				if (verbose >= 3) {
					console.log("Couldn't add the word " + word + " to this grid : \n" + copiedGrid.map((row) => row.join("")).join("\n"));
				};
			};
		};
	};
	return false;
};

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// solve the puzzle
export function crosswordSolver(puzzle, words) {
	if (!(puzzleMeetConditions(puzzle) && wordsMeetConditions(words))) { // are not both puzzle arg valid ?
		return "Error";
	};
	if (verbose >= 2) { console.log("basics conditions are ok"); };
	let grid = puzzle.split("\n").map((row) => row.split(""));

	// get all coor
	let coor = getCoords(grid);
	if (verbose >= 2) {
		console.log(coor)
		console.log("\n ===End==Result===");
	};
	if (puzzleIsPossible(puzzle, words, coor)) {
		let validSolution = true;
		let copiedWords = JSON.parse(JSON.stringify(words));
		let copiedGrid = JSON.parse(JSON.stringify(grid));
		let copiedCoor = JSON.parse(JSON.stringify(coor));
		let solution = undefined;
		if (!solve(copiedCoor, copiedGrid, copiedWords)) {
			console.log("No solution found\n");
			validSolution = false;
		} else {
			solution = copiedGrid.map((row) => [...row]);
			words.reverse();
			copiedWords = JSON.parse(JSON.stringify(words));
			copiedGrid = JSON.parse(JSON.stringify(grid));
			copiedCoor = JSON.parse(JSON.stringify(coor));
			solve(copiedCoor, copiedGrid, copiedWords);
			let reverseSolution = copiedGrid.map((row) => [...row]);
			if (JSON.stringify(solution) !== JSON.stringify(reverseSolution)) validSolution = false;
			for (let i = 0; i < 5 && validSolution; i++) {
				let shuffledWords = JSON.parse(JSON.stringify(shuffleArray([...words])));
				copiedGrid = JSON.parse(JSON.stringify(grid));
				copiedCoor = JSON.parse(JSON.stringify(coor));
				solve(copiedCoor, copiedGrid, shuffledWords);
				let shuffledSolution = copiedGrid.map((row) => [...row]);
				if (JSON.stringify(solution) !== JSON.stringify(shuffledSolution)) validSolution = false;
			}
			if (validSolution) {
				console.log(solution.map((row) => row.join("")).join("\n"));
				console.log();
			} else {
				console.log("Error: multiple solutions found\n");
			}
		};
	} else {
		console.log("the puzzle isn't possible\n");
	};
};
