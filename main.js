// 👇️ named import
import {Player} from './player.js';

// select canvas element
const canvas = document.getElementById("time");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// Load Textures
var _img = document.getElementById('id1');

// hide cursor
canvas.style.cursor = 'none';



// Random number
//var randInt = getRandomInt(2);

// Used to make clips from Textures
class rClip {
    constructor(sx, sy, ew, eh) {
        this.sx = sx;   // Start of clip x coordinate
        this.sy = sy;   // Start of clip y coordinate
        this.ew = ew;   // Clip width
        this.eh = eh;   // Clip height
    }
}

// Create a rectangle
class Rect {
    constructor(x, y, w, h) {
        this.x = x; 
        this.y = y; 
        this.w = w; 
        this.h = h; 
    }
}

// Check collision between two objects
function checkCollision( x,  y,  w,  h,  x2,  y2,  w2,  h2) {
	var collide = false;

	if (x+w > x2 && x < x2 + w2 && 
        y+h > y2 && y < y2 + h2) {
		collide = true;
	}

	return collide;
}

// Load Player textures
var gPlayer = new Image;
var gCursorPlayer = new Image;

// Texture pathes
gPlayer.src = 'gfx/player.png';
gCursorPlayer.src = 'gfx/gCursorPlayer.png';

// Texture clips for Player
let rPlayer = new rClip(36);

// Player Texture clips

// Down clips
for (var i=0; i<9; i++) {
    rPlayer[i] = new rClip(0+i*64, 0, 64, 64);
}

// Up clips
for (var i=0; i<9; i++) {
    rPlayer[i+(9*1)] = new rClip(0+i*64, 64*1, 64, 64);
}

// Right clips
for (var i=0; i<9; i++) {
    rPlayer[i+(9*2)] = new rClip(0+i*64, 64*2, 64, 64);
}

// Left clips
for (var i=0; i<9; i++) {
    rPlayer[i+(9*3)] = new rClip(0+i*64, 64*3, 64, 64);
}

// Load sounds
let sWall = new Audio();
let sScore = new Audio();
let sSlash = new Audio();
let sHit = new Audio();
let sDash = new Audio();

// Sound paths
sWall.src = "sounds/snd_wall.wav";
sScore.src = "sounds/snd_score.wav";
sSlash.src = "sounds/snd_slash.wav";
sHit.src = "sounds/snd_hit.wav";
sDash.src = "sounds/snd_dash.wav";

// Global variables
let gameover = false;
const winningScore = 7;
let editor = true;
let debug = true;
let camlock = false;

const mouse = {
    x : undefined,
    y : undefined,
    mex : undefined,
    mey : undefined,
    newMx : undefined,
    newMy : undefined
}

// Camera
const cam = {
    x : 0,
    y : 0,
    moveLeft : false,
    moveRight : false,
    moveUp : false,
    moveDown : false,
    randomaaa : false,

    // Stop dashing
    Update: function () {

        if (this.moveLeft) {
            this.x -= 5;
        }else if (this.moveRight) {
            this.x += 5;
        }
        if (this.moveUp) {
            this.y -= 5;
        }else if (this.moveDown) {
            this.y += 5;
        }
        this.randomaaa = false;

    }
}

// Level map size
const map = {
    x : 0,
    y : 0,
    w : 1504,
    h : 1088
}

const user = new Player(450, 600, 32, 32, sDash);

function Update() {

    // Stretch canvas to inner width
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get new mouse coordinates
	mouse.mex = mouse.x+cam.x;				// New mouse coordinates
	mouse.mey = mouse.y+cam.y;				// New mouse coordinates


    // Get mouse coordinate newMx and newMy clamped
    var oldMX = mouse.mex;								// New mouse coordinates, relation to camera
    var oldMY = mouse.mey;								// New mouse coordinates, relation to camera

    var clampSize = 32;
    var remainderW = oldMX % clampSize;
    var remainderH = oldMY % clampSize;
    mouse.newMx = mouse.mex - remainderW;						// New mouse coordinates, locked on x32 coordinates
    mouse.newMy = mouse.mey - remainderH;						// New mouse coordinates, locked on x32 coordinates



    // Update Player
    user.Update(mouse, map);

    // Update camera
    cam.Update();

	// Camera lock on Player
	{
		// Get center of player
		var bmx, bmy;

		//var vX_Offset 					= (cos( (3.14159265/180)*(player.angle) ));
		//var vY_Offset 					= (sin( (3.14159265/180)*(player.angle) ));

		//bmx  = (player.x+player.w/2) + (vX_Offset*64) - screenWidth/2;
		//bmy  = (player.y+player.h/2) + (vY_Offset*64) - screenHeight/2;
		bmx  = (user.x+user.w/2) - canvas.width/2;
		bmy  = (user.y+user.h/2) - canvas.height/2;

		// Get distnace from player
       /* var distance = Math.sqrt((bmx - cam.x) * (bmx - cam.x)+
					             (bmy - cam.y) * (bmy - cam.y));
        if (distance < 0.01) {
            distance = 0.01;
        }

		// Camera target
		var vX, vY;

		// If camera distance from player is > 1, go to the player!
		if (distance >= 1){
			vX 	= 1 * (10*distance/256) * (bmx - cam.x) / distance;
			vY 	= 1 * (10*distance/256) * (bmy - cam.y) / distance;

			cam.x += vX;
			cam.y += vY;
		}*/

        if (camlock) {
            cam.x = bmx;
            cam.y = bmy;
        }

		// If map size is less than screen size, do not have camera bounds
		/*if (map.w > canvas.width)
		{
			// The reason we call camera bnounds before camera shaking is because the
			// screen wont shake if called after handling screen shaking
			// Camera bounds
            if( cam.x < map.x ){
                cam.x = map.y;
            }
            if( cam.y < map.y ){
                cam.y = map.y;
            }
            if( cam.x+canvas.width > map.w ){
                cam.x = map.w-canvas.width;
            }
            if( cam.y+canvas.height > map.h ){
                cam.y = map.h-canvas.height ;
            }
		}*/

		// Reduce shake
		/*if (shakeValue > 0) shakeValue -= 0.1;

		// Camera shake
		var shake = powf(shakeValue, 2) * shakePower;

		// Shake camera
		camx += randDouble(-shake, shake);
		camy += randDouble(-shake, shake);*/
	}
}

// draw a rectangle
function drawRect(x, y, w, h, color){
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, w, h);
}

// draw a filled rectangle
function drawFillRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandFloat(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max - min + 1)) + min) /  10; //The maximum is inclusive and the minimum is inclusive 
}

// Render text
function drawText(text,x,y){
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFF";
    ctx.font = "20px fantasy";
    ctx.fillText(text, x, y);
}

// Player Keydown events
document.addEventListener('keydown', (event)=> {

    // Player mode
    if (!editor) {
        if (event.key == "a") {
             user.moveLeft = true;
        }
        if (event.key == "d") {
             user.moveRight = true;
        }
        if (event.key == "w") {
             user.moveUp = true;
        }
        if (event.key == "s") {
             user.moveDown = true;
        }
    
        // If pressed 'n' key, do slash attack
        if (event.key == "n") {
            user.SlashAttack();
        }
    
        // If Spacebar pressed
        if (event.key == " ") {
            user.ActivateDash();
        }
    } 
    
    // Editor mode
    else {
        
        if (event.key == "a") {
            cam.moveLeft = true;
        }
        if (event.key == "d") {
            cam.moveRight = true;
        }
        if (event.key == "w") {
            cam.moveUp = true;
        }
        if (event.key == "s") {
            cam.moveDown = true;
        }
    }
    
    /// Global controls ///
    /// Editor controls ///

    // Toggle debug
    if (event.key == "h")
    {
        debug = (!debug);
    }

   // Toggle Editor
   if (event.key == "p")
   {
        // Disable editor
        if (editor) {
            editor = false;
            camlock = true;
        }

        // Enable editor
        else {
            editor = true;
            camlock = false;
        }
    }
});
 
// Keyup events
document.addEventListener('keyup', (event) => {
   
    // Player mode
   if (!editor) {
       if (event.key == "a") {
           user.moveLeft = false;
       }
       if (event.key == "d") {
           user.moveRight = false;
       }
       if (event.key == "w") {
           user.moveUp = false;
       }
       if (event.key == "s") {
           user.moveDown = false;
       }
   } 
   
   // Editor mode
   else {
        if (event.key == "a") {
            cam.moveLeft = false;
        }
        if (event.key == "d") {
            cam.moveRight = false;
        }
        if (event.key == "w") {
            cam.moveUp = false;
        }
        if (event.key == "s") {
            cam.moveDown = false;
        }
   }
});


 document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

// Update
function UpdateAll(){

    // Set canvas to fill screen
    //ctx.canvas.width  = window.innerWidth;
    //ctx.canvas.height = window.innerHeight;

    Update();

}

// Render an image, with clips
function RenderImg(img, x, y, w, h) {
    ctx.drawImage(img, x, y, w, h);
}

// Render an image, with clips
function RenderImgClip(img, x, y, w, h, rRect = new rClip() ) {
    ctx.drawImage(img, 
                  rRect.sx, rRect.sy, rRect.ew, rRect.eh, 
                  x, y, w, h);
}

// RenderAll function, the function that does all the drawing
function RenderAll(){
    
    // clear the canvas
    drawFillRect(0, 0, canvas.width, canvas.height, "#000");

        // Draw map
        drawFillRect(map.x - cam.x, 
            map.y - cam.y, 
            map.w, 
            map.h, "grey");
    
        // Top left
        drawFillRect(map.x-cam.x, 0-cam.y, 256, 256, "#333");
        
        // Top right
        drawFillRect(map.x+map.w-256-cam.x, 0-cam.y, 256, 256, "#333");
    
        // Bottom left
        drawFillRect(0-cam.x, map.y+map.h-256-cam.y, 256, 256, "#333");
        
        // Bottom right
        drawFillRect(map.x+map.w-256-cam.x, map.y+map.h-256-cam.y, 256, 256, "#333");

        // Render Player
        RenderImgClip(gPlayer, user.x-cam.x, 
            user.y-cam.y, 
            user.w, user.h, 
            rPlayer[user.sprite_index + user.sprite_dir]);

        // Draw Player UI
        {
            if (!editor) {
            }
        }

        // Draw Editor UI
        {
            if (debug) {
                // Draw canvas
                drawRect(mouse.newMx-cam.x, 
                    mouse.newMy-cam.y, 
                    32, 
                    32, "green");
        
                // Draw UI
                // draw the user score to the left
                drawText("x: " + user.x, 0 , 0);
                drawText("y: " + user.y, 0 , 24);
                drawText("vX: " + user.vX, 0 , 24*2);
                drawText("vY: " + user.vY, 0 , 24*3);
                
                drawText("action: " + user.action, 0 , 24*5);
                drawText("dash: " + user.dash, 0 , 24*6);
                drawText("dashCounter: " + user.dashCounter, 0 , 24*7);
                drawText("dashCooldown: " + user.dashCooldown, 0 , 24*8);
                


                drawText("sprite_index: " + user.sprite_index, 320 , 24*5);
                drawText("sprite_dir: " + user.sprite_dir, 320, 24*6);
                drawText("both: " + (user.sprite_index+user.sprite_dir), 320, 24*7);
            }
        }

        // Draw cursor
        RenderImg(gCursorPlayer, mouse.mex-cam.x-10, mouse.mey-cam.y-10, 20, 20)
        
}

function game(){
    UpdateAll();
    RenderAll();
}

// number of frames per second
let framePerSecond = 60;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);


