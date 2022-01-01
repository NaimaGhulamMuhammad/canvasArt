let canvas;
let ctx;
let canvasExperience;
let canvasExperienceAnimation;
const mouse = {x:0, y:0};

var bgSound = new Audio();
bgSound.src = 'sounds/Wintersong.mp3';
bgSound.volume = 0.2;

var sound = new Audio();
sound.src = 'sounds/twinkling.mp3';
sound.autoplay = true;
sound.volume = 0.1;


let size = document.getElementById('cellSize').value;
let speed = document.getElementById('speed').value;
let width = document.getElementById('lineWidth').value;
let zoomIn = document.getElementById('zoomIn').value;
let zoomOut = document.getElementById('zoomOut').value;

const onSizeChange = (value) => {
    size = value;
    canvasExperience.setCellSize(Number(size));
}
const onWidthChange = (value) => {
    width = value;
    canvasExperience.setLineWidth(Number(width));
}
const onSpeedChange = (value) => {
    speed = value;
    canvasExperience.setVr(Number(speed));
}
onZoomInChange = (value) => {
    zoomIn = value;
    canvasExperience.setZoomIn(Number(value));
}
onZoomOutChange = (value) => {
    zoomOut = value;
    canvasExperience.setZoomOut(Number(value));
}

//after loading the page
window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight;
    canvasExperience = new CanvasExperience(ctx,canvas.width, canvas.height, Number(size), Number(speed),Number(width),Number(zoomIn),Number(zoomOut));
    canvasExperience.animate(0);
    console.log(size,speed,width);
    // bgSound.muted = false;
    // bgSound.play();
}

bgSound.addEventListener('playing', function() {
    console.log('playing');
})
//when resizing the window
window.addEventListener("resize", function(e) {
    cancelAnimationFrame(canvasExperienceAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasExperience = new CanvasExperience(ctx,canvas.width, canvas.height, size,speed,width, zoomIn, zoomOut);
    canvasExperience.animate(0);
})
//when mouse is moving
window.addEventListener("mousemove", function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
    sound.muted = false;
    sound.play();
})
window.addEventListener("mouseout", function(e) {
    sound.muted = true;
    sound.pause();
})
// Canvas Expereince

class CanvasExperience{
    //private variables
    #ctx;
    #width;
    #height;

    //constructor
    constructor(ctx,width,height, size, speed, lineWidth, zoomIn,zoomOut){
        this.#ctx = ctx
        this.#width = width ;
        this.#height = height ;
        this.cellSize = size;
        this.vr = speed;
        this.#ctx.lineWidth = lineWidth;
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 0;
        this.zoomIn = zoomIn;
        this.zoomOut = zoomOut;
        bgSound.muted = true;
        bgSound.play();
    }

    //setter methods
    setCellSize(value){
        this.cellSize = value;
    }
    setLineWidth(value){
        this.#ctx.lineWidth = value;
    }
    setVr(value){
        this.vr = value;
    }
    setZoomIn(value){
        this.zoomIn = value;
    }
    setZoomOut(value){
        this.zoomOut = value;
    }

    //gradient
    //further can be improved
    #createGradient(){
    this.gradient = this.#ctx.createLinearGradient(0,0, this.#width, this.#height);
    this.gradient.addColorStop("0.1", '#ff5c33');
    this.gradient.addColorStop("0.2", '#ff66b3');
    this.gradient.addColorStop("0.4", '#ccccff');
    this.gradient.addColorStop("0.6", '#b3ffff');
    this.gradient.addColorStop("0.8", '#80ff80');
    this.gradient.addColorStop("0.9", '#ffff30');
    }
    
    //method to draw line animation
    #drawLine(angle, x,y){
        let positionX = x ;
        let positionY = y ;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = (dx * dx + dy * dy) * 6;
        if(distance > 600000) distance = 600000;
        else if (distance < 50000) distance = 50000;
        const length = distance/10000;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + Math.cos(angle) * length,y +Math.sin(angle) * length);
        this.#ctx.stroke();
       
    }

    //animation
    animate(timeStamp){
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if(this.timer > this.interval){
            this.#ctx.clearRect(0,0, this.#width, this.#height);
            this.radius += this.vr;
            if(this.radius > 5 || this.radius < -5) this.vr *= -1;
            for(let y = 0; y < this.#height; y+=this.cellSize){
                for(let x = 0; x < this.#width; x+=this.cellSize){
                    const angle = (Math.cos(x * this.zoomIn)  + Math.sin(y * this.zoomOut)) * this.radius;
                    this.#drawLine(angle,x,y);
                }
            }
            this.timer = 0;
        }
        else{
            this.timer += deltaTime;
        }
        canvasExperienceAnimation = requestAnimationFrame((this.animate.bind(this)));
    }
}