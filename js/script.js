// This variable represents the initial value of the countdown.
let countdown = 30;
// This variable represents the interval of the countdown.
let countdownInterval;
// This variable represents if the player has moved or not.
let playerMoved = false;
// This variable represents if the countdown has started or not.
let countdownStarted = false;
// This variable represents if the game has started or not.
let gameStarted = false;
// This variable represents if the player has moved for the first time or not.
let gameStartedForProtagonist = true;
// This variable represents the interval of the main() function.
let mainInterval;
// This variable represents the canvas element in the HTML document.
let canvas;
// This variable represents the context of the canvas.
let ctx;
/*
 * This variable represents the number of frames per second of the game. It is crucial
 * to calculate the interval when the main() function is called.
 */
const FPS = 50;
// This variable represents the width of each tile in the map.
let width = 50;
// This variable represents the height of each tile in the map.
let height = 50;
// This variable represents the main player of the game.
let protagonist;
// This array represents the enemies in the game.
let enemies = [];
// This array represents the lights in the game.
let lights = [];
// This variable represents the image that contains all the tiles of the game.
let tileMap;
// This variable forbids the toast to be shown more than once.
let canToastBeShown = true;
// This array represents the map of the game. Each number corresponds to a different tile.
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

/**
 * Function called when the init() function is called. It basically transform the map array
 * into a graphic map calling the ctx.drawImage() function, which has the following params:
 *  @param {tileMap} The image to draw the map from.
 *  @param {tile * 32} The x coordinate of the top left corner of the tile in the image.
 *  @param {0} The y coordinate of the top left corner of the tile in the image.
 *  @param {32} The width of the tile in the image.
 *  @param {32} The height of the tile in the image.
 *  @param {x * width} The x coordinate of the top left corner of the tile on the screen.
 *  @param {y * height} The y coordinate of the top left corner of the tile on the screen.
 *  @param {width} The width of the tile on the screen.
 *  @param {height} The height of the tile on the screen.
 */
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

/**
 * This object represents a light in the game. It has the following params:
 * @param {*} x The x coordinate of this light object.
 * @param {*} y The y coordinate of this light object.
 * It also has the following properties:
 * @property {x} The x coordinate of this light object.
 * @property {y} The y coordinate of this light object.
 * @property {delay} The delay between each frame of the light's animation.
 * @property {index} The current index of the light's animation.
 * @property {frame} The current frame of the light's animation.
 * @property {changeFrame} A function that changes the frame of the light's animation.
 * @property {draw} A function that draws the light on the screen. It calls the
 *  ctx.drawImage() function to draw the light, which has the following params:
 *   @param {tileMap} The image to draw the light from.
 *   @param {0} The x coordinate of the top left corner of the light in the image.
 *   @param {64} The y coordinate of the top left corner of the light in the image.
 *   @param {32} The width of the light in the image.
 *   @param {32} The height of the light in the image.
 *   @param {this.x * width} The x coordinate of the top left corner of the light
 *    on the screen.
 *   @param {this.y * height} The y coordinate of the top left corner of the light
 *    on the screen.
 *   @param {width} The width of the light on the screen.
 *   @param {height} The height of the light on the screen.
 */
let light = function (x, y) {
	this.x = x;
	this.y = y;
	this.delay = 10;
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

/**
 * This object represents an enemy in the game. It has the following params:
 * @param {*} x The current x coordinate of the enemy.
 * @param {*} y The current y coordinate of the enemy.
 * It also has the following properties:
 * @property {x} The current x coordinate of the enemy.
 * @property {y} The current y coordinate of the enemy.
 * @property {direction} The direction the enemy is moving in. 0 = up, 1 = down,
 *  2 = left, 3 = right.
 * @property {delay} The delay between each movement of the enemy.
 * @property {frame} The current frame of the enemy's animation.
 * @property {draw} A function that draws the enemy on the screen. It calls the
 *  ctx.drawImage() function to draw the enemy, which has the following params:
 *   @param {tileMap} The image to draw the enemy from.
 *   @param {0} The x coordinate of the top left corner of the enemy in the image.
 *   @param {32} The y coordinate of the top left corner of the enemy in the image.
 *   @param {32} The width of the enemy in the image.
 *   @param {32} The height of the enemy in the image.
 *   @param {this.x * width} The x coordinate of the top left corner of the enemy.
 *   @param {this.y * height} The y coordinate of the top left corner of the enemy.
 *   @param {width} The width of the enemy.
 *   @param {height} The height of the enemy.
 * @property {checkEnemyCollision} A function that checks if the enemy
 *  is colliding with a wall.
 * @property {moveRandomly} A function that moves the enemy in a random direction.
 */
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
			if (this.direction == 0) {
				if (!this.checkEnemyCollision(this.x, this.y - 1)) {
					this.y--;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			if (this.direction == 1) {
				if (!this.checkEnemyCollision(this.x, this.y + 1)) {
					this.y++;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			if (this.direction == 2) {
				if (!this.checkEnemyCollision(this.x - 1, this.y)) {
					this.x--;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
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

/**
 * This object represents the player. It has the following properties:
 *  @property {number} x - The x coordinate of the player.
 *  @property {number} y - The y coordinate of the player.
 *  @property {boolean} key - The key that the player has to collect
 *   to open the door to pass the level.
 *  @property {function} draw - This function draws the player
 *   by calling the ctx.drawImage() method. This method takes 9 arguments:
 *    1. The image to draw.
 *    2. The x coordinate of the upper left corner of the image.
 *    3. The y coordinate of the upper left corner of the image.
 *    4. The width of the image.
 *    5. The height of the image.
 *    6. The x coordinate of the upper left corner of the canvas.
 *    7. The y coordinate of the upper left corner of the canvas.
 *    8. The width of the image in the canvas.
 *    9. The height of the image in the canvas.
 *  @property {function} controlMargins - This function controls the margins bounds
 *   by setting a collision variable to true if the player is trying to go out of the map.
 *  @property {function} goUp - This function controls the player's movement to go up.
 *  @property {function} goDown - This function controls the player's movement to go down.
 *  @property {function} goLeft - This function controls the player's movement to go left.
 *  @property {function} goRight - This function controls the player's movement to go right.
 *  @property {function} checkKeyAndDoor - This function checks if the player has the key
 *   and if he/she can open the door.
 *  @property {function} checkCollisionWithEnemy - This function checks if the player
 *   has collided with an enemy. In that case, the game is over.
 *  @property {function} win - This function checks if the player has won the game.
 *  @property {function} lose - This function checks if the player has lost the game.
 */
let player = function () {
	this.x = 1;
	this.y = 1;
	this.key = false;
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
	this.controlMargins = (x, y) => {
		let collision = false;
		if (map[y][x] == 0) {
			collision = true;
		}
		return collision;
	};
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
	this.checkKeyAndDoor = () => {
		let field = map[this.y][this.x];
		if (field == 3) {
			this.key = true;
			map[this.y][this.x] = 2;
			if (canToastBeShown) {
				Toastify({
					text: "You found the key!",
					duration: 3000,
					close: false,
					gravity: "bottom",
					position: "center",
					stopOnFocus: false,
					style: {
						background:
							"linear-gradient(to right, #212529, #004e4e)",
						border: "0.2rem solid #8d6900",
						borderRadius: "0.375rem",
					},
				}).showToast();

				canToastBeShown = false;

				setTimeout(() => {
					canToastBeShown = true;
				}, 3000);
			}
		}
		if (field == 1) {
			if (this.key) {
				this.win();
			} else {
				if (canToastBeShown) {
					Toastify({
						text: "You need the key to open the door!",
						duration: 3000,
						close: false,
						gravity: "bottom",
						position: "center",
						stopOnFocus: false,
						style: {
							background:
								"linear-gradient(to right, #d37029, red)",
							border: "0.2rem solid #8d6900",
							borderRadius: "0.375rem",
						},
					}).showToast();

					canToastBeShown = false;

					setTimeout(() => {
						canToastBeShown = true;
					}, 3000);
				}
			}
		}
	};
	this.checkCollisionWithEnemy = (x, y) => {
		if (this.x == x && this.y == y) {
			this.lose();
		}
	};
};

/**
 * Function that updates the countdown. Consider that this function is called every second.
 * as part of an interval called in the init() function. However, only when the player has
 * moved for the first time, the countdown begins to be reduced.
 * Furthermore, the soundtrack of the game is played when the countdown is 30 seconds and
 * is paused when the countdown is 0 or simply when the player has not moved
 * for the first time.
 * @returns It goes out of the function if the player has not moved for the first time.
 */
const updateCountdown = () => {
	if (!countdownStarted) {
		countdown = 31;
	}

	document.getElementById("countdownAudio").play();

	if (!gameStartedForProtagonist) {
		clearInterval(countdownInterval);
		document.getElementById("countdownAudio").pause();
		return;
	}

	countdown--;
	if (countdown === 0) {
		clearInterval(countdownInterval);
		protagonist.lose();
		document.getElementById("countdownAudio").pause();
	}

	document.getElementById("countdown").textContent = countdown + "s";

	if (countdown === 30) {
		document.getElementById("countdownAudio").play();
	}
};

/**
 * Function that resets the countdown to 31 seconds.
 */
const resetCountdown = () => {
	clearInterval(countdownInterval);
	countdown = 31;
	document.getElementById("countdown").textContent = countdown + "s";
};

/**
 * Function that empties the enemies array and adds 3 new enemies to it.
 * This way, the enemies are back to their original position and don't move
 * until the player starts the game again.
 */
const resetEnemies = () => {
	enemies = [];
	enemies.push(new enemy(4, 4));
	enemies.push(new enemy(13, 1));
	enemies.push(new enemy(6, 8));
};

/**
 * Function called when the player wins or loses the game. It performs the following actions:
 * 	1. It sets the gameStartedForProtagonist variable to false.
 * 	2. It resets the countdown.
 * 	3. It clears the countdown interval and sets a new one with a 1 second interval.
 * 	4. It creates a new player.
 *  5. If lights are less than 4, it adds 4 new lights to the array where they are stored.
 * 	6. It resets the enemies.
 * 	7. It updates the countdown.
 */
const restartLevel = () => {
	gameStartedForProtagonist = true;
	resetCountdown();
	clearInterval(countdownInterval);
	countdownInterval = setInterval(updateCountdown, 1000);
	protagonist = new player();

	if (lights.length < 4) {
		lights.push(new light(0, 0));
		lights.push(new light(0, 9));
		lights.push(new light(14, 0));
		lights.push(new light(14, 9));
	}

	resetEnemies();
	updateCountdown();
};

/**
 * Function called when the page is loaded. It performs the following actions:
 *  1. It clears the countdown interval and sets a new one with a 1 second interval.
 *  2. It clears the main interval.
 *  3. It gets the canvas and its context.
 *  4. It loads the tilemap image.
 *  5. It creates the protagonist.
 *  6. It sets the lights, but only if there weren't lights before.
 *  7. It resets the enemies.
 *  8. It adds an event listener to the document to detect when a key is pressed.
 *  9. It establishes a call to the main function every 1 second interval.
 */
const init = () => {
	clearInterval(countdownInterval);
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

	resetEnemies();

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

/**
 * Function that erases the canvas.
 */
const eraseCanvas = () => {
	canvas.width = 750;
	canvas.height = 500;
};

/**
 * This function is called every 1 second interval when the init() function is called.
 * It performs the following actions:
 *  1. It erases the canvas.
 *  2. It draws the map.
 *  3. It draws the protagonist.
 *  4. It draws the enemies.
 *  5. If the game has started, it moves the enemies randomly.
 *  6. It draws the lights.
 *  7. If the protagonist has moved for the first time, it clears the countdown interval.
 */
const main = () => {
	eraseCanvas();
	drawMap();
	protagonist.draw();

	for (let i = 0; i < enemies.length; i++) {
		enemies[i].draw();
		if (gameStarted) {
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
