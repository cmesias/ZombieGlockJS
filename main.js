// select canvas element
const canvas = document.getElementById("time");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// Load Textures
var _img = document.getElementById('id1');

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

// Texture pathes
gPlayer.src = 'gfx/player.png';

// Texture clips for Player
let rPlayer = new rClip(36);

// Player Texture clips

// Down clips
for (var i=0; i<9; i++) {
    rPlayer[i] = new rClip(0, 0, 64, 64);
}

// Up clips
for (var i=9; i<18; i++) {
    rPlayer[i] = new rClip(0, 64, 64, 64);
}

// Right clips
for (var i=18; i<27; i++) {
    rPlayer[i] = new rClip(0, 64*2, 64, 64);
}

// Left clips
for (var i=27; i<36; i++) {
    rPlayer[i] = new rClip(0, 64*3, 64, 64);
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

// Player
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





const map = {
    x : 0,
    y : 0,
    w : 1504,
    h : 1088
}

// Player
const user = {
    x : canvas.width/2,                          // left side of canvas
    y : (canvas.height - 64)/2,     // -100 the height of paddle
    w : 32,
    h : 32,
    width : 32,
    height : 32,
    alive : true,
    score : 0,
    angle: 0.0,
    color : "WHITE",
    ControlsPreference : 1,

    // Movement
    moveLeft : false,
    moveRight : false,
    moveUp : false,
    moveDown : false,
    moving : false,
    sprint : false,
    vX : 0.0,
    vY : 0.0,
	velMax : 1.00,
	velSpeed : 0.50,
    speed : 6,

    // Animation
    walkTimer : 0,                      // Used for animating walk
    facing : "right",
    flipW : false,
    sprite_index : 0,
    image_index : 0,
	sprite_dir : 0,
	sprite_dir_list : [0,9,18,27],

    // Dash
    dash : false,						// Dash ability
	dashSpeed : 15,					    // Default: 15
	dashLength : 5,					    // Default: 5
	dashCounter : 0,				    // Default: 0
	dashCoolCounter : 0,				// Default: 0
	dashCooldown : 60 * 3,	            // Default: 60

	// Attack
	attackTimer : 0,
	attackFrame : 5,
	attack : false,
	attackType	: -1,
	promptContinueAttacking : false,
	startCombo	: false,

	// Delay
	delayTimer  : 0,
	delay :false,

    // Stop dashing
    StopDashing: function () {
        // Reset dash timers
        this.dash               = false;
        this.dashCounter 	    = 0;
        this.dashCoolCounter    = this.dashCooldown;
    },

    // Dash abiity
    ActivateDash: function () {
       	// If Dash is not on cool down
        if (this.dashCoolCounter <= 0 && this.dashCounter <=0 && !attack) {

            // Make sure we are not parrying before dashing
            // Because we dont want to stop the animation of parrying
            // if we dash.
            if (!this.parry) {

                // Stop attacking
                //if (this.attack) {
                //    StopSlashAttack();
                //}

                // Depending on which way the player is moving,
                if (this.moveleft) {
                    this.vX -= this.dashSpeed;
                }else if (moveright) {
                    this.vX += this.dashSpeed;
                }
                if (this.moveup) {
                    this.vY -= this.dashSpeed;
                }else if (movedown) {
                    this.vY += this.dashSpeed;
                }
                this.dash = true;
                this.dashCounter = this.dashLength;

                // Play SFX
                sDash.play();
            }
        }
    },

    // Attack ability
    SlashAttack: function ()
    {
        // If attacking on certain attack, prompt to continue to a combo
        if (this.attackType == 0 || this.attackType == 1)
        {
            // For combos
            this.promptContinueAttacking = true;
        }

        if (!this.delay) {
            if (!this.attack && !this.stunned && !this.parry) {

                // If currently dashing
                if (this.dash)
                {
                    // Stop dashing
                    StopDashing();
                }

                // Set attack parameters
                this.sprite_index = 5;
                this.clash = false;
                this.attack = true;

                // Do this attack based on which attack we're currently on
                if (this.attackType == -1)
                {
                    // Attack 1
                    this.attackType = 0;

                    // Animation Atk Speed
                    this.atkAnimSpe = 3;
                }
            }
        }
    },

    Update: function () {

		////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////
		//--------------------------------- Facing Mouse ----------------------------------//
        
        // Get player angle based on mouse coordinates
        if (this.ControlsPreference == 1) {

            var bmx = this.x+this.w/2;
            var bmy = this.y+this.h/2;

            var bmx2 = mouse.mex;
            var bmy2 = mouse.mey;

            this.angle = Math.atan2(bmy2 - bmy,bmx2 - bmx);
            this.angle = this.angle * (180 / 3.1416);
        }
        //Set player angle max limits
        if (this.angle < 0) {
            this.angle = 360 - (-this.angle);
        }
		//--------------------------------- Facing Mouse ----------------------------------//
		////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////

		////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////
		//----------------------------------- Movement -----------------------------------//
        
        // If sprinting, change max movement speed
        this.sprint = true;
        if (this.sprint) {
            this.velMax = 2;
            this.velSpeed = 1;
        } else {
            this.velMax = 1.00;
            this.velSpeed = 0.50;
        }

        // X Axis movement
        {
            if (this.moveLeft && !this.attack && !this.delay && !this.parry && !this.dash) {
                if (this.vX > -this.velMax) {
                    this.vX -= this.velSpeed;
                }
                this.moving = true;
                if (this.ControlsPreference == 0) {
                   // if (!this.shift) {
                        this.facing = "left";
                        this.sprite_dir = this.sprite_dir_list[3];
                        this.angle = 180.0;
                    //}
                }
            }
            // Move right
            if (this.moveRight && !this.attack && !this.delay && !this.parry && !this.dash) {
                if (this.vX < this.velMax) {
                    this.vX += this.velSpeed;
                }
                this.moving = true;
                if (this.ControlsPreference == 0) {
                    //if (!this.shift) {
                        this.facing = "right";
                        this.sprite_dir = this.sprite_dir_list[2];
                        this.angle = 0.0;
                    //}
                }
            }
        }

        // Y Axis movement
        {
            // Move up
            if ((this.moveUp && !this.attack && !this.delay && !this.parry && !this.dash)) {
                if (this.vY > -this.velMax) {
                    this.vY -= this.velSpeed;
                }
                this.moving = true;
                if (this.ControlsPreference == 0) {
                    //if (!this.shift) {
                        this.facing = "up";
                        this.sprite_dir = this.sprite_dir_list[1];
                        this.angle = 270.0;
                    //}
                }
            }
            // Move down
            if (this.moveDown && !this.attack && !this.delay && !this.parry && !this.dash) {
                if (this.vY < this.velMax) {
                    this.vY += this.velSpeed;
                }
                this.moving = true;
                if (this.ControlsPreference == 0) {
                   // if (!this.shift) {
                        this.facing = "down";
                        this.sprite_dir = this.sprite_dir_list[0];
                        this.angle = 90.0;
                   // }
                }
            }
        }

        // Apply movement
		this.x += this.vX;
		this.y += this.vY;

        // Mouse controls
        {
			// If ControlsPreference is "1" then we will override the direction above ^
			if (this.ControlsPreference == 1)
            {
				// Facing right
				if (this.angle >= 315 || this.angle < 45) {
		        	this.facing = "right";
		        	this.sprite_dir = this.sprite_dir_list[2];
				}

				// Facing down
				else if (this.angle >= 45 && this.angle < 135) {
		        	this.facing = "down";
		        	this.sprite_dir = this.sprite_dir_list[0];
				}

				// Facing left
				else if (this.angle >= 135 && this.angle < 225) {
		        	this.facing = "left";
		        	this.sprite_dir = this.sprite_dir_list[3];
				}

				// Facing up
				else if (this.angle >= 225 && this.angle < 315) {
		        	this.facing = "up";
		        	this.sprite_dir = this.sprite_dir_list[1];
				}
			}

			// If not dashing
			/*if (!this.dash) {
				// Max X speed
				if (this.vX < -this.velMax) {
			        vX = vX - vX * 0.01;
				}
				if (this.vX > this.velMax) {
			        vX = vX - vX * 0.01;
				}
				// Max Y speed
				if (this.vY < -this.velMax) {
			        vY = vY - vY * 0.01;
				}
				if (this.vY > this.velMax) {
			        vY = vY - vY * 0.01;
				}
			}*/
        }

		// Player not moving X
		if (!this.moveLeft && !this.moveRight && !this.dash) {
	        this.vX = this.vX - this.vX * 0.15;
		}

		// Player not moving Y
		if (!this.moveUp && !this.moveDown && !this.dash) {
	        this.vY = this.vY - this.vY * 0.15;
		}

		// Player not moving
		if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight && !this.dash) {
			this.moving = false;

			// Stop sprinting
			this.sprint = false;
		}

        // Player map boundaries
        if( this.x < map.x ){
            this.x = map.x;
        }
        if( this.y < map.y ){
            this.y = map.y;
        }
        if( this.x+this.w > map.x+map.w ){
           this.x = map.x+map.w - this.w;
        }
        if( this.y+this.h > map.y+map.h ){
           this.y = map.y+map.h - this.h;
        }

		//----------------------------------- Movement -----------------------------------//
		////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////


		////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////
		//---------------------------------- Animations ----------------------------------//
        if (!this.attack)
        {
            // Idle animation
            if (!this.moving) {
                this.sprite_index = 0;

            // Moving animation
            } else {

                // If not attacking
                //if (!this.attack) {

                    ///////////////////////////////////////////////////////////////////////////
                    //-----------------------------------------------------------------------//
                    //----------------------------- Do walkTimer ----------------------------//
                    {
                        // Walk anim speed
                        var walkTimerSpe;
                        if (this.sprint)
                            walkTimerSpe = 11;
                        else
                            walkTimerSpe = 10;

                        // Increment animation timer
                        this.walkTimer += walkTimerSpe;

                        // Increment current animation frame
                        if (this.walkTimer > 60)
                        {
                            // Reset timer
                            this.walkTimer = 0;
                            // Go to next animation frame
                            this.sprite_index++;
                        }

                        // Reset sprite
                        if (this.sprite_index > 3) {
                            this.sprite_index = 0;
                        }
                    }
                    //----------------------------- Do walkTimer ----------------------------//
                    //-----------------------------------------------------------------------//
                    ///////////////////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////////////////
                    //-----------------------------------------------------------------------//
                    //--------------------------- Do walkTimerVFX ---------------------------//
                    /*{
                        // WalkSFXSpe
                        float walkVFXSpe;
                        if (sprint)
                            walkVFXSpe = 5;
                        else
                            walkVFXSpe = 4;

                        //	Increase walkTimerVFX
                        walkTimerVFX += walkVFXSpe;

                        // If walkTimer is at 30 frames
                        if (walkTimerVFX > 60)
                        {
                            walkTimerVFX = 0;

                            // Visual and audio effects
                            {
                                // Spawn particle
                                int tempAngel = 0;
                                float adjustX = 0;
                                if (facing == "left" ) {
                                    tempAngel = 0;
                                    adjustX = 8;
                                } else if (facing == "right" ) {
                                    tempAngel = 180;
                                    adjustX = -8;
                                }

                                // Spawn size and pos
                                int randSize = rand() % 5 + 5;

                                float spawnX = getX() + this.w/2 + adjustX;
                                float spawnY = getY() + this.h;

                                // Spawn particle effect at feet
                                p_dummy.spawnParticleAngle(particle, 3, 2,
                                                    spawnX-randSize/2,
                                                    spawnY-randSize/2,
                                                    randSize, randSize,
                                                    tempAngel, randDouble(0.1, 0.4),
                                                    0.0, 0, 0,
                                                    {255, 255, 255, 255}, 1,
                                                    1, 1,
                                                    rand() % 100 + 150, rand() % 2 + 5,
                                                    rand() % 50 + 90, 0,
                                                    true, randDouble(0.1, 0.7),
                                                    100, 10);

                                // Play sound effect
                                Mix_PlayChannel(-1, settings->sStep, 0);
                            }
                        }
                    }*/
                    //--------------------------- Do walkTimerVFX ---------------------------//
                    //-----------------------------------------------------------------------//
                    ///////////////////////////////////////////////////////////////////////////
                //}
            }
        }
		//---------------------------------- Animations ----------------------------------//
		////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////

        

		// Animations
		{
			///////////////////////////////////////////////////////////////////////////
			//-----------------------------------------------------------------------//
			//------------------------------- Do Dash -------------------------------//
			if (this.dash) {

				if (this.dashCounter >= 0 && this.dashCounter < 2) {
					this.sprite_index = 4;
				}
				else if (this.dashCounter >= 2 && this.dashCounter < 4) {
					this.sprite_index = 4;
				}
				else if (dthis.ashCounter >= 4 && this.dashCounter < 6) {
					this.sprite_index = 4;
				}
				else if (this.dashCounter >= 6 && this.dashCounter < 8) {
					this.sprite_index = 4;
				}
				else if (this.dashCounter >= 8 && this.dashCounter < 10) {
					this.sprite_index = 4;
				}

				/*var rands = rand() % 9 + 2;
				var newX = getX() + w/2;
				var newY = getY() + h;
				p_dummy.spawnParticleAngle(particle, 3, 2,
									newX-rands/2,
									newY-rands/2,
								   rands, rands,
								   0, randDouble(0.1, 0.3),
								   0.0, 0, 0,
								   {255, 255, 255, 255}, 1,
								   1, 1,
								   rand() % 100 + 150, rand() % 2 + 5,
								   rand() % 50 + 90, 0,
								   true, 0.11,
								   rand() % 9 + 2, 1);*/

				// If dash counter is greater than 0
				if (this.dashCounter > 0) {

					// Subtract dash counter by 1 every frame
					this.dashCounter -= 1;
				}
				// If dash counter goes lower than 0
				else {

					// Stop player movement
					//StopMovement();
                    this.vX = 0.0;
                    this.vY = 0.0;

					// Dash on cool down
					this.dash = false;

					// Start dash cool down timer
					this.dashCoolCounter = this.dashCooldown;
				}
			}

			//------------------------------- Do Dash -------------------------------//
			//-----------------------------------------------------------------------//
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////
			//-----------------------------------------------------------------------//
			//----------------------------- Do Attacking ----------------------------//
			// If attacking
			else if (this.attack)
			{
				if (!this.delay)
					{
					// Stop player movement
					//this.StopMovement();
                    this.vX = 0.0;
                    this.vY = 0.0;

					///////////////////////////////////////////////////////////////////////////////////////////
					//---------------------------------------------------------------------------------------//
					//--------------------------------------- Attack 1 --------------------------------------//
					if (this.attackType == 0)
					{
						// Increase attack timer/frames
						this.attackTimer += this.atkAnimSpe;

						// If User presses to attack within X amount of time, continue attack
						if (this.attackTimer >= 60 && this.attackTimer < 90) {
							if (this.promptContinueAttacking) {
								this.startCombo = true;
							} else {
								this.startCombo = false;
							}
						}

						// Before slash
						if (this.attackTimer >= 0 && this.attackTimer < 60) {
							this.sprite_index = 5;
						}

						// Next-slash (Attack 1)
						else if (this.attackTimer >= 60 && this.attackTimer < 90) {
							this.sprite_index = this.sprite_index_attack_1;

							// attackTimer @ 60
							if (this.attackTimer == 60)
							{
								// Move forward in direction
								//MoveForward();

								// Recoil gun
								//gunOffsetRecoil -= 20;

								// Spawn atk Obj
								//this.SpawnAttackObject(obj, object);
							}
						}

						// End Attack
						else {

							// Continue to combo 2
							if (this.startCombo) {

								// Go to attack 2
								{
									// Stop prompt for continuing combo
									this.promptContinueAttacking = false;
									this.startCombo = false;

									// Next attack
									this.attackTimer = 0;
									this.attackType = 1;
									this.atkAnimSpe = 5;
								}
							}

							// Stop attacking
							else {

								// Reset attack-type
								this.attackType = -1;
								this.attackTimer = 0;
								this.attack = false;
								//this.initialshot = false;
							}
						}
					}
					///////////////////////////////////////////////////////////////////////////////////////////
					//---------------------------------------------------------------------------------------//
					//--------------------------------------- Attack 2 --------------------------------------//

					// If attack-type: Slash Attack
					if (this.attackType == 1)
					{
						// Increase attack timer/frames
						this.attackTimer += this.atkAnimSpe;

						// If User presses to attack within X amount of time, continue attack
						if (this.attackTimer >= 60 && this.attackTimer < 90) {
							if (this.promptContinueAttacking) {
								this.startCombo = true;
							} else {
								this.startCombo = false;
							}
						}

						// Before slash
						if (this.attackTimer >= 0 && this.attackTimer < 60) {
							this.sprite_index = 5;
						}

						// (Attack 2)
						else if (this.attackTimer >= 60 && this.attackTimer < 90) {
							this.sprite_index = this.sprite_index_attack_2;

							// attackTimer @ 90
							if (this.attackTimer == 60)
							{
								// Move forward in direction
								//MoveForward();

								// Recoil gun
								//gunOffsetRecoil -= 22;

								// Spawn atk Obj
								//this.SpawnAttackObject(obj, object);
							}
						}

						// End Attack
						else {

							// Continue to combo 3
							if (this.startCombo) {

								// Go to attack 3
								{
									// Stop prompt for continuing combo
									this.promptContinueAttacking = false;
									this.startCombo = false;

									// Next attack
									this.attackTimer = 0;
									this.attackType = 2;
									this.atkAnimSpe = 3;
								}
							}

							// Stop attacking
							else {

								// Reset attack-type
								this.attackType = -1;
								this.attackTimer = 0;
								this.attack = false;
								//this.initialshot = false;
							}
						}
					}
					///////////////////////////////////////////////////////////////////////////////////////////
					//---------------------------------------------------------------------------------------//
					//--------------------------------------- Attack 3 --------------------------------------//

					// If attack-type: Slash Attack
					if (this.attackType == 2)
					{
						// Increase attack timer/frames
						this.attackTimer += this.atkAnimSpe;

						// Before slash
						if (this.attackTimer >= 0 && this.attackTimer < 60) {
							this.sprite_index = 5;
						}

						// (Attack 3)
						else if (this.attackTimer >= 60 && this.attackTimer < 90) {
							this.sprite_index = this.sprite_index_attack_3;

							// attackTimer @ 120
							if (this.attackTimer == 60)
							{
								// Move forward in direction
								//MoveForward();

								// Recoil gun
								//gunOffsetRecoil -= 30;

								// Spawn atk Obj
								//this.SpawnAttackObject(obj, object);
							}
						}

						// End Attack
						else {

							// Stop combo
							this.startCombo = false;
							this.promptContinueAttacking = false;

							// Reset attack-type
							this.attackType = -1;
							this.attackTimer = 0;
							this.attack = false;
							//this.initialshot = false;
						}
					}
				}
			}

			// Start delay after attacking
			if (this.delay)
			{
				// Start delay (the faster the attakc speed, the sooner the delay ends
				this.delayTimer += this.meleeAtkSpeed;

				// Delay over
				if (this.delayTimer > 60)
				{
					// Stop delay
					this.delayTimer = 0;
					this.delay = false;
				}
			}
			//----------------------------- Do Attacking ----------------------------//
			//-----------------------------------------------------------------------//
			///////////////////////////////////////////////////////////////////////////

			///////////////////////////////////////////////////////////////////////////
			//-----------------------------------------------------------------------//
			//------------------------------ Do Parrying ----------------------------//
			// Parrying animation
			if (this.parry)
			{
				// Stop movement
				//StopMovement();
                this.vX = 0.0;
                this.vY = 0.0;

				// Determine direction
				this.sprite_index = 3;

				// Start Parrying timer
				this.parryTimer++;

				// Parry for 15 frames
				if (this.parryTimer > this.parryLength){
					this.parryTimer = 0;
					this.parry = false;
					//this.StopParrying();
				}
			// Parry cool-down
			} else if (!this.parry) {
				if (this.parryCDTimer > 0) {
					this.parryCDTimer -= 1;
				}
			}
			//------------------------------ Do Parrying ----------------------------//
			//-----------------------------------------------------------------------//
			///////////////////////////////////////////////////////////////////////////

			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////
			//------------------------- Handle Dash Cooldown ------------------------//

			// If dash on cooldown
			if (!this.dash) {

				// Start cooldown countdown
				if (this.dashCoolCounter > 0) {
					this.dashCoolCounter -= 1;
				}
			}

			//------------------------- Handle Dash Cooldown ------------------------//
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////


		} // end Animations

        // Player level boundaries
        /*if(this.x < 0 ){
            this.x = 0;
        }
        if(this.y < 0 ){
            this.y = 0;
        }
        if(this.x+this.w > canvas.width/2 ){
            this.x = canvas.width/2-this.w;
        }
        if(this.y+this.h > canvas.height){
            this.y = canvas.height-this.h;
        }*/
    }
}

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

    // Update camera
    cam.Update();

    // Update Player
    user.Update();

    // If collision happened between Ball and AI
    /*if  (checkCollision(ball.x-ball.radius, ball.y-ball.radius, ball.radius*2, ball.radius*2, com.x, com.y, com.width, com.height))
    {
        //
    }

    // Winner
    if (user.score >= winningScore || com.score >= winningScore) {
        gameover = true;
    }

    // If not game over, continue game
    if (!gameover)
    {
        // the ball has a velocity
        ball.x += ball.vX;
        ball.y += ball.vY;
    
        // computer plays for itself, and we must be able to beat it
        // simple AI
        com.y += ((ball.y - (com.y + com.height/2)))*0.05;
    } 
    
    // There is a winner!
    else {
        
    }*/
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
        drawRect(map.x - cam.x, 
            map.y - cam.y, 
            map.w, 
            map.h, "green");
    
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
        //drawText(user.score,canvas.width/4,canvas.height/5);

        // Draw game over ctx
        /*if (gameover) {
            if (user.score >= winningScore) {
                drawText("Congrats, you win!", canvas.width/2, canvas.height * 0.75, "center");
            }
            if (com.score >= winningScore) {
                drawText("You lose, AI wins.", canvas.width/2, canvas.height * 0.75, "center");
            }
            drawText("Press 'Spacebar' to restart game.", canvas.width/2, canvas.height * 0.90, "center");
        }*/
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
            drawText("editor: " + editor, 0 , 24*3);
            drawText("debug: " + debug, 0 , 24*4);
            drawText("camlock: " + camlock, 0 , 24*5);
        }
    }
}

function game(){
    UpdateAll();
    RenderAll();
}

// number of frames per second
let framePerSecond = 60;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);


