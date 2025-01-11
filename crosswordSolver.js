/* verbose is used for debugging. a value of 0 only print the result. 1 add informations about initial parameters.
   2 add detailled error messages. 3 show the puzzle grid after each iteration in the backtracking algorithm and its manipulations.
*/
const verbose = 0;

//is this char a number that we can use
function is_numeric(c) {
	return /^[0-2]+$/.test(c);
}
//is this the start of a word ?
function is_start(c) {
	return /^[1-2]+$/.test(c);
}

//is the puzzle in parameter correct ?
function puzzleMeetConditions(puzzle){
	if (verbose >= 1){console.log(puzzle);};
	if (typeof puzzle !== 'string'){
		if (verbose >= 2){console.log("this puzzle isn't a string");};
		return false;
	};
	let puzzleMap = puzzle.split("\n");
	if (puzzleMap.length === 1){ 
		if (verbose >= 2){console.log("this isn't a crossword but a single line");};
		return false;
	};

	let lineLength = puzzleMap[0].length;
	for (let line = 0; line < puzzleMap.length; line++){
		if (puzzleMap[line].length !== lineLength){ return false }; // the puzzle isn't a rectangle
		for (let col = 0; col < lineLength; col++){
			//for each character, check if it's an empty char or a number;
			if (puzzleMap[line][col] !== '.' && !is_numeric(puzzleMap[line][col])){ 
				if (verbose >= 2){
					console.log("this character isn't right " + puzzleMap[line][col] );
					console.log("this character is on position " + line + " and " + col);
				};
				return false; 
			};
		};
	};
	return true;
};

//is the words array correct ?
function wordsMeetConditions(words){
	if (!Array.isArray(words)){
		if (verbose >= 2){console.log("words isn't an array");};
		return false;
	};
	for (let i = 0; i < words.length; i++){
		if ( typeof  words[i] != 'string' || (!/^[A-Za-z]+$/.test(words[i]))){
			if (verbose >= 2){ console.log("this part of the words array isn't a word : " + words[i]); };
			return false;
		};
		words[i] = words[i].toLowerCase();
	};
	const set = new Set(words);
	if ( set.size !== words.length ){
		if (verbose >= 2){ console.log("some words are in double in the words array");};
		return false;
	};
	
	return true;
};

//is it possible to complete this puzzle ?
function puzzleIsPossible(puzzle, words, coor){
	let expectedNumberOfWords = 0;
	for (let i = 0; i < puzzle.length; i++){
		if ( is_numeric(puzzle[i]) ){ expectedNumberOfWords += Number(puzzle[i]);};
	};

	if (expectedNumberOfWords !== words.length || expectedNumberOfWords !== coor.length){
		if ( verbose >= 2 ){
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
	let verticalLen   = 0;
	
	//if we are on the far left; or if we arn't we need to be sure there isn't another word going on horizontally
	if ( col === 0 || (col > 0 && grid[row][col - 1] === ".") ){
		//at this point, those words CAN be horizontal, so we need to check on the right of the starting case
		for (let i = col; i < grid[0].length && grid[row][i] !== "."; i++) {
			horizontalLen++;
		};
	};

	if ( row === 0 || (row > 0 && grid[row - 1][col] === ".") ) {
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
				let [h_len, v_len] = lenBothDirectionFrom(i, j ,grid);
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

function placeWord(word, coordinate, grid) {
	for (let i = 0; i < word.length; i++) {
		if (coordinate.isHorizontal) {
			grid[coordinate.row][coordinate.col + i] = word[i];
		} else {
			grid[coordinate.row + i][coordinate.col] = word[i];
		};
	};
};

function removeWord(grid, coordinate, initial_grid) {
	if ( verbose >= 3 ){ console.log("removing a word");};
	for (let i = 0; i < coordinate.length; i++) {
		if (coordinate.isHorizontal) {
			grid[coordinate.row][coordinate.col + i] = initial_grid[coordinate.row][coordinate.col + i];
		} else {
			grid[coordinate.row + i][coordinate.col] = initial_grid[coordinate.row + i][coordinate.col];
		};
	};
	if ( verbose >= 3 ){ console.log("The grid without the word : \n" + grid.map((row) => row.join("")).join("\n"));};
};

function canPlace(word, coordinate, grid) {
	if ( word.length === coordinate.length ){ // check if the word is the right size for the spot
		if ( verbose >= 3 ){ console.log("the word " + word + " fit");};
		let noWrongChar = true;
		for ( let i = 0; i < word.length && noWrongChar; i++){ // here we want to be sure we are not writing over a different letter of another word. 
			let a = coordinate.row;
			let b = coordinate.col;
			if ( coordinate.isHorizontal ){ b += i; } else { a += i; };
			if ( grid[a][b] >= "a" && grid[a][b] <= "z" && word[i] !== grid[a][b]){
				if ( verbose >= 3 )console.log("our char : " + word[i] + " and the one in the grid : " + grid[a][coordinate.col + i])
				noWrongChar = false;
			};
		};
		if ( noWrongChar ){
			return true;
		} else {
			if ( verbose >= 3 ){ console.log("a character doesn't match");};
		}
	} else {
		if ( verbose >= 3 ){ console.log("the word can't fit");};
	};
	return false;
};

function solve(coor, grid, words) {
	let initial_grid = grid.map((row) => [...row]);
	if (verbose >= 3) console.log("\n" + initial_grid.map((row) => row.join("")).join("\n"))
	if (words.length === 0 && coor.length === 0) {
		return true;
	}
	//For each coordinates we try to fill with a word
	for (let coor_idx = 0; coor_idx < coor.length; coor_idx++) {
		const actual_coor = coor[coor_idx];
		//try to find the correct word
		for (let words_idx = 0; words_idx < words.length; words_idx++) {
			const word = words[words_idx];
			if (canPlace(word, actual_coor, grid)) {
				placeWord(word, actual_coor, grid);
				words.splice(words_idx, 1);
				coor.splice(coor_idx, 1);
				if (solve(coor, grid, words)) return true;
				//grid = initial_grid.map((row) => [...row]);
				removeWord(grid, actual_coor, initial_grid);
				words.splice(words_idx, 0, word);
				coor.splice(coor_idx, 0, actual_coor);
			} else {
				if (verbose >= 3) {
					console.log("Couldn't add the word " + word + " to this grid : \n" + grid.map((row) => row.join("")).join("\n"));
				};
			};
		};
	};
	initial_grid = null;
	return false;
};

//solve the puzzle
function crosswordSolver(puzzle, words){
	if ( !(puzzleMeetConditions(puzzle) && wordsMeetConditions(words)) ) { //are not both puzzle arg valid ?
		return "Error";
	};
	if ( verbose >= 1 ){ console.log("basics conditions are ok");};
	let grid = puzzle.split("\n").map((row) => row.split(""));

	//get all coor
	let coor = getCoords(grid);
	if ( verbose >= 1 ){ 
		console.log(coor)
		console.log("\n ===End==Result===");};
	if (puzzleIsPossible(puzzle, words, coor)) {
		if (solve(coor, grid, words)) {
			console.log(grid.map((row) => row.join("")).join("\n"));
			console.log();
		} else {
			console.log("No solution found\n");
		};
	} else {
		console.log("the puzzle isn't possible\n");
	};
};
