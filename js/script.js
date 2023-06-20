// This code creates a map for a game. The map is a 2D array of numbers that correspond to different tiles. The code uses the numbers to determine which color to use for each tile. The map is displayed on the screen using a canvas.

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

let light = function(x, y) {
    this.x = x;
    this.y = y;
    this.delay = 50;
    this.index = 0;
    this.frame = 0;
    this.changeFrame = () => {
        if(this.frame < 3){
            this.frame++;
        }else{
            this.frame = 0;
        }
    }
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
    
}


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
        if(this.index < this.delay){
            this.index++;
        }else{
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
		}
	};
	// This code controls the player's movement to go down with the keyboard.
	this.goDown = () => {
		if (!this.controlMargins(this.x, this.y + 1)) {
			this.y++;
			this.checkKeyAndDoor();
		}
	};
	// This code controls the player's movement to go left with the keyboard.
	this.goLeft = () => {
		if (!this.controlMargins(this.x - 1, this.y)) {
			this.x--;
			this.checkKeyAndDoor();
		}
	};
	// This code controls the player's movement to go right with the keyboard.
	this.goRight = () => {
		if (!this.controlMargins(this.x + 1, this.y)) {
			this.x++;
			this.checkKeyAndDoor();
		}
	};
	// This code controls the player's movement to win the game.
	this.win = () => {
		console.log("You won!");
		this.x = 1;
		this.y = 1;
		this.key = false;
		map[8][3] = 3;
	};
    this.lose = () => {
		console.log("You lost!");
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
        if(this.x == x && this.y == y){
            this.lose();
        }
    }
};

// This code initializes the game.
const init = () => {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	tileMap = new Image();
	tileMap.src = "assets/tileMap.png";

	protagonist = new player();

    lights.push(new light(0, 0));
    lights.push(new light(0, 9));
    lights.push(new light(14, 0));
    lights.push(new light(14, 9));

	enemies.push(new enemy(3, 3));
	enemies.push(new enemy(5, 7));
	enemies.push(new enemy(7, 7));

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

	setInterval(() => {
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
        enemies[i].moveRandomly();
		enemies[i].draw();
	}

    for (let i = 0; i < lights.length; i++) {
        lights[i].draw();
    }
};
