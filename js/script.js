// This code creates a map for a game. The map is a 2D array of numbers that correspond to different tiles. The code uses the numbers to determine which color to use for each tile. The map is displayed on the screen using a canvas.
let countdown = 30;
let countdownInterval;
let playerMoved = false;
let countdownStarted = false;
let gameStarted = false;
let gameStartedForProtagonist = true;
let mainInterval;
let canvas;
let ctx;
const FPS = 50;
let width = 50;
let height = 50;
let wall = "#044f14";
let door = "#3a1700";
let earth = "#c6892f";
let key = "#c6bc00";
let protagonist;
let enemies = [];
let lights = [];
let tileMap;
let map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0],
	[0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0],
	[0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0],
	[0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
	[0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
	[0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0],
	[0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0],
	[0, 2, 2, 3, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//This code draws the map, with different colors representing each item.
const drawMap = () => {
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 15; x++) {
			let tile = map[y][x];
			ctx.drawImage(
				tileMap,
				tile * 32,
				0,
				32,
				32,
				x * width,
				y * height,
				width,
				height
			);
		}
	}
};

let light = function (x, y) {
	this.x = x;
	this.y = y;
	this.delay = 50;
	this.index = 0;
	this.frame = 0;
	this.changeFrame = () => {
		if (this.frame < 3) {
			this.frame++;
		} else {
			this.frame = 0;
		}
	};
	this.draw = () => {
		if (this.index < this.delay) {
			this.index++;
		} else {
			this.index = 0;
			this.changeFrame();
		}

		ctx.drawImage(
			tileMap,
			this.frame * 32,
			64,
			32,
			32,
			this.x * width,
			this.y * height,
			width,
			height
		);
	};
};

let enemy = function (x, y) {
	this.x = x;
	this.y = y;
	this.direction = Math.floor(Math.random() * 4);
	this.delay = 50;
	this.frame = 0;
	this.draw = () => {
		ctx.drawImage(
			tileMap,
			0,
			32,
			32,
			32,
			this.x * width,
			this.y * height,
			width,
			height
		);
	};
	this.checkEnemyCollision = (x, y) => {
		let enemyCollision = false;
		if (map[y][x] == 0) {
			enemyCollision = true;
		}
		return enemyCollision;
	};
	this.moveRandomly = () => {
		protagonist.checkCollisionWithEnemy(this.x, this.y);
		if (this.index < this.delay) {
			this.index++;
		} else {
			this.index = 0;
			// ARRIBA
			if (this.direction == 0) {
				if (!this.checkEnemyCollision(this.x, this.y - 1)) {
					this.y--;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			// ABAJO
			if (this.direction == 1) {
				if (!this.checkEnemyCollision(this.x, this.y + 1)) {
					this.y++;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			// IZQUIERDA
			if (this.direction == 2) {
				if (!this.checkEnemyCollision(this.x - 1, this.y)) {
					this.x--;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			// DERECHA
			if (this.direction == 3) {
				if (!this.checkEnemyCollision(this.x + 1, this.y)) {
					this.x++;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
		}
	};
};

// This code creates the player, and controls its movement.
let player = function () {
	this.x = 1;
	this.y = 1;
	this.color = "#820c01";
	this.key = false;
	// This code draws the player.
	this.draw = () => {
		ctx.drawImage(
			tileMap,
			32,
			32,
			32,
			32,
			this.x * width,
			this.y * height,
			width,
			height
		);
	};
	// This code controls the player's movement with the collisions.
	this.controlMargins = (x, y) => {
		let collision = false;
		if (map[y][x] == 0) {
			collision = true;
		}
		return collision;
	};
	// This code controls the player's movement to go up with the keyboard.
	this.goUp = () => {
		if (!this.controlMargins(this.x, this.y - 1)) {
			this.y--;
			this.checkKeyAndDoor();
			playerMoved = true;
			if (!countdownStarted) {
				countdownStarted = true;
				gameStarted = true;
				updateCountdown();
			}
		}
	};
	// This code controls the player's movement to go down with the keyboard.
	this.goDown = () => {
		if (!this.controlMargins(this.x, this.y + 1)) {
			this.y++;
			this.checkKeyAndDoor();
			playerMoved = true;
			if (!countdownStarted) {
				countdownStarted = true;
				gameStarted = true;
				updateCountdown();
			}
		}
	};
	// This code controls the player's movement to go left with the keyboard.
	this.goLeft = () => {
		if (!this.controlMargins(this.x - 1, this.y)) {
			this.x--;
			this.checkKeyAndDoor();
			playerMoved = true;
			if (!countdownStarted) {
				countdownStarted = true;
				gameStarted = true;
				updateCountdown();
			}
		}
	};
	// This code controls the player's movement to go right with the keyboard.
	this.goRight = () => {
		if (!this.controlMargins(this.x + 1, this.y)) {
			this.x++;
			this.checkKeyAndDoor();
			playerMoved = true;
			if (!countdownStarted) {
				countdownStarted = true;
				gameStarted = true;
				updateCountdown();
			}
		}
	};
	// This code controls the player's movement to win the game.
	this.win = () => {
		this.key = false;
		playerMoved = false;
		countdownStarted = false;
		gameStarted = false;
		gameStartedForProtagonist = false;
		resetEnemies();
		resetCountdown();
		Swal.fire({
			title: "You won!",
			text: "Do you want to continue?",
			icon: "success",
			confirmButtonText: "Go to the next level!",
		}).then(() => {
			restartLevel();
		});
		this.x = 1;
		this.y = 1;
		map[8][3] = 3;
	};
	this.lose = () => {
		playerMoved = false;
		countdownStarted = false;
		gameStarted = false;
		gameStartedForProtagonist = false;
		resetEnemies();
		resetCountdown();
		Swal.fire({
			title: "You lost!",
			text: "Someone killed you!",
			icon: "error",
			confirmButtonText: "Try again!",
		}).then(() => {
			restartLevel();
		});
		this.x = 1;
		this.y = 1;
		this.key = false;
		map[8][3] = 3;
	};

	// This code controls the player's movement to find the key and open the door.
	this.checkKeyAndDoor = () => {
		let field = map[this.y][this.x];

		if (field == 3) {
			this.key = true;
			map[this.y][this.x] = 2;
			console.log("You found the key!");
		}

		if (field == 1) {
			if (this.key) {
				this.win();
			} else {
				console.log("You need the key to open the door!");
			}
		}
	};
	this.checkCollisionWithEnemy = (x, y) => {
		if (this.x == x && this.y == y) {
			this.lose();
		}
	};
};

const updateCountdown = () => {
	if (!countdownStarted) {
		countdown = 31;
	}

	document.getElementById("countdownAudio").play(); // Start the music

	if (!gameStartedForProtagonist) {
		clearInterval(countdownInterval);
		document.getElementById("countdownAudio").pause(); // Stop the music
		return;
	}

	countdown--;
	if (countdown === 0) {
		clearInterval(countdownInterval);
		protagonist.lose();
		document.getElementById("countdownAudio").pause(); // Stop the music
	}

	document.getElementById("countdown").textContent = countdown + "s";

	if (countdown === 30) {
		document.getElementById("countdownAudio").play(); // Start the music
	}
};

const resetCountdown = () => {
	clearInterval(countdownInterval);
	countdown = 31;
	document.getElementById("countdown").textContent = countdown + "s";
};

const resetEnemies = () => {
	enemies = [];
	enemies.push(new enemy(4, 4));
	enemies.push(new enemy(13, 1));
	enemies.push(new enemy(6, 8));
};

const restartLevel = () => {
	gameStartedForProtagonist = true;
	resetCountdown();
	clearInterval(countdownInterval); // Detener el intervalo anterior
	countdownInterval = setInterval(updateCountdown, 1000);
	protagonist = new player();

	if (lights.length < 4) {
		lights.push(new light(0, 0));
		lights.push(new light(0, 9));
		lights.push(new light(14, 0));
		lights.push(new light(14, 9));
	}

	resetEnemies(); // Reset the enemies
	updateCountdown();
};

const init = () => {
	clearInterval(countdownInterval); // Detener el intervalo anterior
	clearInterval(mainInterval);
	countdownInterval = setInterval(updateCountdown, 1000);
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	tileMap = new Image();
	tileMap.src = "assets/tileMap.png";

	protagonist = new player();

	if (lights.length < 4) {
		lights.push(new light(0, 0));
		lights.push(new light(0, 9));
		lights.push(new light(14, 0));
		lights.push(new light(14, 9));
	}

	resetEnemies(); // Reset the enemies

	document.addEventListener("keydown", (key) => {
		if (key.keyCode == 38) {
			protagonist.goUp();
		}
		if (key.keyCode == 40) {
			protagonist.goDown();
		}
		if (key.keyCode == 37) {
			protagonist.goLeft();
		}
		if (key.keyCode == 39) {
			protagonist.goRight();
		}
	});

	mainInterval = setInterval(() => {
		main();
	}, 1000 / FPS);
};

// This code erases the canvas.
const eraseCanvas = () => {
	canvas.width = 750;
	canvas.height = 500;
};

// This code draws the canvas.
const main = () => {
	eraseCanvas();
	drawMap();
	protagonist.draw();

	for (let i = 0; i < enemies.length; i++) {
		enemies[i].draw();
		if(gameStarted){
			enemies[i].moveRandomly();
		}
	}

	for (let i = 0; i < lights.length; i++) {
		lights[i].draw();
	}

	if (!gameStartedForProtagonist) {
		clearInterval(countdownInterval);
	}
};
