let canvas;
let ctx;
const FPS = 50;
let width = 50;
let height = 50;
let wall = '#044f14';
let door = '#3a1700';
let earth = '#c6892f';
let key = '#c6bc00';
let protagonistColor = '#820c01';
let map = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,2,2,0,0],
    [0,0,2,2,2,2,2,0,0,0],
    [0,0,2,0,0,0,2,2,0,0],
    [0,0,2,2,2,0,0,2,0,0],
    [0,2,2,0,0,0,0,2,0,0],
    [0,0,2,0,0,0,2,2,2,0],
    [0,2,2,2,0,0,2,0,0,0],
    [0,2,2,2,0,0,2,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];

const drawMap = () => {
    let color;
    for(let y = 0; y < 10; y++){
        for(let x = 0; x < 10; x++){
            if(map[y][x] == 0){
                color = wall;
            }
            if(map[y][x] == 1){
                color = door;
            }
            if(map[y][x] == 2){
                color = earth;
            }
            if(map[y][x] == 3){
                color = key;
            }
            ctx.fillStyle = color;
            ctx.fillRect(x*width, y*height, width, height);
        }
    }
}

let player = function(){
    this.x = 1;
    this.y = 1;
    this.color = "#820c01";
    this.draw = () => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x*width, this.y*height, width, height);
    }
    this.controlMargins = (x, y) => {
        let colission = false;
        if(map[y][x] == 0){
            colission = true;
        }
        return colission;
    }
    this.goUp = () => { 
        if(!this.controlMargins(this.x, this.y-1)){
            this.y--;
        }
    }
    this.goDown = () => {    
        if(!this.controlMargins(this.x, this.y+1)){
            this.y++;
        } 
    }
    this.goLeft = () => {
        if(!this.controlMargins(this.x-1, this.y)){
            this.x--;
        }
    }
    this.goRight = () => {
        if(!this.controlMargins(this.x+1, this.y)){
            this.x++;
        }
    }
}

let protagonist;

const init = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    protagonist = new player();

    document.addEventListener('keydown', (key) => {
        if(key.keyCode == 38){
            protagonist.goUp();
        }
        if(key.keyCode == 40){
            protagonist.goDown();
        }
        if(key.keyCode == 37){
            protagonist.goLeft();
        }
        if(key.keyCode == 39){
            protagonist.goRight();
        }
    });

    setInterval(() => {
        main();
    }, 1000/FPS);
}

const eraseCanvas = () => {
    canvas.width = 500;
    canvas.height = 500;
}

const main = () => {    
    eraseCanvas();
    drawMap();
    protagonist.draw();
}

// Prueba

// NUEVO COMENTARIO