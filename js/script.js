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

const protagonist = {
    x: 1,
    y: 1,
    color: protagonistColor,
    draw: function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x*width, this.y*height, width, height);
    }
}

const init = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
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
}