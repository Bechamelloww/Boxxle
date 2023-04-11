import { Levels } from './level.js'
let keyName = ''
let levelNum = 0
let maxLevelNum = Levels.length
console.log(maxLevelNum);
let baseArray
let gameArray
let gameboard = document.querySelector('#gameboard');
let stats = document.querySelector('#stats')
let bigdiv = document.querySelector('.bigdiv')
let playerPos = [0, 0]
const empty = 0
const wall = 1
const box = 2
const player = 3
const goal = 4
const goalbox = 5
let goals = 0
let goalCount = 0
let final = 0
let stepcounter = 0
console.log(Levels);
let gameMusic = new Audio("/ressources/Hunting-for-your-Dream-8-bit-Cov.mp3");
let winningSound = new Audio("/ressources/Victory Sound Effect.mp3");
let boxOnGoalSound = new Audio("/ressources/beep.mp3");
let finalwinMusic = new Audio("/ressources/hyori ittai 8bitt.mp3");
let playerAnim
gameMusic.loop = true
finalwinMusic.loop = true

window.onload = init;

function playerAnimChange(str) {
	playerAnim = document.querySelector('.player')
	if (str == "up") {
		playerAnim.className = 'cell playerUp'
	}
	if (str == "left") {
		playerAnim.className = 'cell playerLeft'
	}
	if (str == "down") {
		playerAnim.className = 'cell playerDown'
	}
	if (str == "right") {
		playerAnim.className = 'cell playerRight'
	}
}

function drawLevel() {
	for (let i = 0; i < gameArray.length; i++) {
		for (let j = 0; j < gameArray[i].length; j++) {
			let cell = document.createElement('div');
			cell.classList.add('cell');
			if (gameArray[i][j] === 0) {
				cell.classList.add('empty');
			}
			if (gameArray[i][j] === 1) {
				cell.classList.add('wall');
			}
			if (gameArray[i][j] === 2) {
				cell.classList.add('box');
			}
			if (gameArray[i][j] === 3) {
				cell.classList.add('player');
			}
			if (gameArray[i][j] === 4) {
				cell.classList.add('goal');
			}
			if (gameArray[i][j] === 5) {
				cell.classList.add('goalbox');
			}
			gameboard.appendChild(cell);
		}
	}
	stats.innerHTML = `
		<h2>Nombre de pas : ${stepcounter}</h2>
		<h2>Nombre d'objectifs : ${goals}</h2>
		<h1>Niveau : ${levelNum}</h1>
	`
}

function removeLevel() {
	let cells = document.querySelectorAll('.cell')
	for (let i = 0; i < cells.length; i++) {
		cells[i].remove();
	}
}

function getNbGoals() {
	for (let i = 0; i < baseArray.length; i++) {
		for (let j = 0; j < baseArray[i].length; j++) {
			if (baseArray[i][j] == goal) {
				goals++
			}
		}
	}
}

function reInit() {
	gameboard = document.querySelector('#gameboard');
	goals = 0
	final = 0
	goalCount = 0
	levelNum = 0
	console.log("NIVEAU : " + levelNum);
	gameMusic.play()
	baseArray = Levels[levelNum].map(function (arr) { // on fait un deep clone sinn l'array change quand même
		return arr.slice();
	});
	gameArray = Levels[levelNum]
	console.log("LEVEL : " + gameArray);
	getNbGoals()
	console.log(playerPos);
	resetLevel()
	playerPos = getPlayerPos()
	// Request an animation frame for the first time
	// The gameLoop() function will be called as a callback of this request
	gameMusic.play()
	window.requestAnimationFrame(gameLoop);
}

function resetLevel() {
	removeLevel()
	final = 0
	goalCount = 0
	stepcounter = 0
	gameArray = baseArray.map(function (arr) { // on fait un deep clone sinn l'array change quand même
		return arr.slice();
	});
	drawLevel()
}

function reAssignGoals() {
	removeLevel()
	for (let i = 0; i < baseArray.length; i++) {
		for (let j = 0; j < baseArray[i].length; j++) {
			if (baseArray[i][j] == goal && gameArray[i][j] == empty) {
				gameArray[i][j] = 4
			}
			if ((baseArray[i][j] == goal && gameArray[i][j] == goalbox) || (baseArray[i][j] == goal && gameArray[i][j] == box)) {
				gameArray[i][j] = 5
				goalCount++
				if (goalCount == goals) {
					final = 1
				}
			}
		}
	}
	stepcounter++
	console.log("GOALCOUNT : " + goalCount);
	console.log("GOALS : " + goals);
	goalCount = 0
	drawLevel()
}

function init() {
	console.log("NIVEAUUUU : " + levelNum);
	console.log("LEVELLLL : " + gameArray);
	baseArray = Levels[levelNum].map(function (arr) { // on fait un deep clone sinn l'array change quand même
		return arr.slice();
	});
	gameArray = Levels[levelNum]
	getNbGoals()
	console.log(playerPos);
	drawLevel();
	playerPos = getPlayerPos()
	// Request an animation frame for the first time
	// The gameLoop() function will be called as a callback of this request
	gameMusic.play()
	window.requestAnimationFrame(gameLoop);
}

function getPlayerPos() {
	for (let i = 0; i < gameArray.length; i++) {
		for (let j = 0; j < gameArray[i].length; j++) {
			if (gameArray[i][j] === 3) {
				return [i, j]
			}
		}
	}
}

function playerMoveDown() {
	//playerPos == [1, 1]

	console.log("position du joueur : " + playerPos);

	if (gameArray[playerPos[0] + 1][playerPos[1]] == empty) {
		gameArray[playerPos[0] + 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("up")
	}
	if (gameArray[playerPos[0] + 1][playerPos[1]] == goal) {
		gameArray[playerPos[0] + 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("up")
	}
	if (gameArray[playerPos[0] + 1][playerPos[1]] == box && gameArray[playerPos[0] + 2][playerPos[1]] == empty) {
		gameArray[playerPos[0] + 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] + 2][playerPos[1]] = box
		reAssignGoals()
		playerAnimChange("up")
	}
	if (gameArray[playerPos[0] + 1][playerPos[1]] == box && gameArray[playerPos[0] + 2][playerPos[1]] == goal) {
		gameArray[playerPos[0] + 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] + 2][playerPos[1]] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("up")
	}
	if (gameArray[playerPos[0] + 1][playerPos[1]] == goalbox && gameArray[playerPos[0] + 2][playerPos[1]] == empty) {
		gameArray[playerPos[0] + 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] + 2][playerPos[1]] = box
		reAssignGoals()
		playerAnimChange("up")
	}
	if (gameArray[playerPos[0] + 1][playerPos[1]] == goalbox && gameArray[playerPos[0] + 2][playerPos[1]] == goal) {
		gameArray[playerPos[0] + 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] + 2][playerPos[1]] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("up")
	}
}

function playerMoveUp() {
	//playerPos == [1, 1]

	console.log("position du joueur : " + playerPos);

	if (gameArray[playerPos[0] - 1][playerPos[1]] == empty) {
		gameArray[playerPos[0] - 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("down")
	}
	if (gameArray[playerPos[0] - 1][playerPos[1]] == goal) {
		gameArray[playerPos[0] - 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("down")
	}
	if (gameArray[playerPos[0] - 1][playerPos[1]] == box && gameArray[playerPos[0] - 2][playerPos[1]] == empty) {
		gameArray[playerPos[0] - 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] - 2][playerPos[1]] = box
		reAssignGoals()
		playerAnimChange("down")
	}
	if (gameArray[playerPos[0] - 1][playerPos[1]] == box && gameArray[playerPos[0] - 2][playerPos[1]] == goal) {
		gameArray[playerPos[0] - 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] - 2][playerPos[1]] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("down")
	}
	if (gameArray[playerPos[0] - 1][playerPos[1]] == goalbox && gameArray[playerPos[0] - 2][playerPos[1]] == empty) {
		gameArray[playerPos[0] - 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] - 2][playerPos[1]] = box
		reAssignGoals()
		playerAnimChange("down")
	}
	if (gameArray[playerPos[0] - 1][playerPos[1]] == goalbox && gameArray[playerPos[0] - 2][playerPos[1]] == goal) {
		gameArray[playerPos[0] - 1][playerPos[1]] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0] - 2][playerPos[1]] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("down")
	}
	console.log(playerAnim);
}

function playerMoveRight() {
	//playerPos == [1, 1]

	console.log("position du joueur : " + playerPos);

	if (gameArray[playerPos[0]][playerPos[1] + 1] == empty) {
		gameArray[playerPos[0]][playerPos[1] + 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("right")
	}
	if (gameArray[playerPos[0]][playerPos[1] + 1] == goal) {
		gameArray[playerPos[0]][playerPos[1] + 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("right")
	}
	if (gameArray[playerPos[0]][playerPos[1] + 1] == box && gameArray[playerPos[0]][playerPos[1] + 2] == empty) {
		gameArray[playerPos[0]][playerPos[1] + 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] + 2] = box
		reAssignGoals()
		playerAnimChange("right")
	}
	if (gameArray[playerPos[0]][playerPos[1] + 1] == box && gameArray[playerPos[0]][playerPos[1] + 2] == goal) {
		gameArray[playerPos[0]][playerPos[1] + 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] + 2] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("right")
	}
	if (gameArray[playerPos[0]][playerPos[1] + 1] == goalbox && gameArray[playerPos[0]][playerPos[1] + 2] == empty) {
		gameArray[playerPos[0]][playerPos[1] + 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] + 2] = box
		reAssignGoals()
		playerAnimChange("right")
	}
	if (gameArray[playerPos[0]][playerPos[1] + 1] == goalbox && gameArray[playerPos[0]][playerPos[1] + 2] == goal) {
		gameArray[playerPos[0]][playerPos[1] + 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] + 2] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("right")
	}
}

function playerMoveLeft() {
	//playerPos == [1, 1]

	console.log("position du joueur : " + playerPos);

	if (gameArray[playerPos[0]][playerPos[1] - 1] == empty) {
		gameArray[playerPos[0]][playerPos[1] - 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("left")
	}
	if (gameArray[playerPos[0]][playerPos[1] - 1] == goal) {
		gameArray[playerPos[0]][playerPos[1] - 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		reAssignGoals()
		playerAnimChange("left")
	}
	if (gameArray[playerPos[0]][playerPos[1] - 1] == box && gameArray[playerPos[0]][playerPos[1] - 2] == empty) {
		gameArray[playerPos[0]][playerPos[1] - 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] - 2] = box
		reAssignGoals()
		playerAnimChange("left")
	}
	if (gameArray[playerPos[0]][playerPos[1] - 1] == box && gameArray[playerPos[0]][playerPos[1] - 2] == goal) {
		gameArray[playerPos[0]][playerPos[1] - 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] - 2] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("left")
	}
	if (gameArray[playerPos[0]][playerPos[1] - 1] == goalbox && gameArray[playerPos[0]][playerPos[1] - 2] == empty) {
		gameArray[playerPos[0]][playerPos[1] - 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] - 2] = box
		reAssignGoals()
		playerAnimChange("left")
	}
	if (gameArray[playerPos[0]][playerPos[1] - 1] == goalbox && gameArray[playerPos[0]][playerPos[1] - 2] == goal) {
		gameArray[playerPos[0]][playerPos[1] - 1] = player
		gameArray[playerPos[0]][playerPos[1]] = empty
		gameArray[playerPos[0]][playerPos[1] - 2] = box
		boxOnGoalSound.play()
		reAssignGoals()
		playerAnimChange("left")
	}
}

document.addEventListener('keydown', (event) => {
	keyName = event.key;
	playerPos = getPlayerPos()
}, false);

function finishAndReload() {
	removeLevel()
	gameMusic.pause()
	finalwinMusic.play()
	bigdiv.innerHTML = `
	<div class="salut">
	<h1>BRAVO !</h1>
	<button id="myButton">RECOMMENCER</button>
	<img src="/ressources/hamsterwin.gif" class="winImg">
	</div>
	`
	let againButton = document.getElementById('myButton')
	againButton.onclick = function () {
		console.log("hhahahahahhaa");
		bigdiv.innerHTML = `
		<div class="card">
			<div id="gameboard"></div>
		</div>
		<div class="card2">
			<div class="rules">
				<h1>BOXXLE</h1>
				<h2>ECHAP pour RESET le niveau / SUPPR pour tout recommencer.</h2>
				<br>
				<p>Le but du jeu est de positionner toutes les caisses sur les objectifs rouges.</p>
				<br>
				<p>Une fois cet acte accompli, vous passerez au niveau suivant !</p>
				<br>
				<div id="stats"></div>
			</div>
		</div>
	`
		finalwinMusic.pause()
		// reInit() (enlevé car g pas tt fait en deepcopy du coup ça fait npq + ça réinitialise pas la musique du coup autant juste refresh la page)
		location.reload()
	}
}

function gameLoop() {
	if (final == 1) {
		winningSound.play();
		goals = 0
		final = 0
		goalCount = 0
		if (levelNum + 1 >= maxLevelNum) {
			finishAndReload()
		}
		levelNum += 1
		stepcounter = 0
		removeLevel()
		init()
	}
	if (keyName == 'Escape') {
		console.log("RESET!!!");
		keyName = 0
		resetLevel()
	}
	if (keyName == 'Delete') {
		location.reload()
	}
	if (keyName == 'ArrowUp') {
		console.log("flècheHaut");
		keyName = 0
		playerMoveUp()
	}
	if (keyName == 'ArrowDown') {
		console.log("flècheBas");
		keyName = 0
		playerMoveDown()
	}
	if (keyName == 'ArrowLeft') {
		console.log("flècheGauche");
		keyName = 0
		playerMoveLeft()
	}
	if (keyName == 'ArrowRight') {
		console.log("flècheDroite");
		keyName = 0
		playerMoveRight()
	}
	// The loop function has reached it's end
	// Keep requesting new frames
	window.requestAnimationFrame(gameLoop);
}

