// 👇️ named export
export class Player {

    constructor(x, y, w, h, sDash) {
        this.sDash = sDash;                          // left side of canvas
        this.x = x;                          // left side of canvas
        this.y = y;     // -100 the height of paddle
        this.w = w;
        this.h = h;
        this.alive = true;
        this.score = 0;
        this.angle= 0.0;
        this.color = "WHITE";
        this.ControlsPreference = 1;

        // Movement
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.moving = false;
        this.sprint = false;
        this.vX = 0.0;
        this.vY = 0.0;
        this.velMax = 1.00;
        this.velSpeed = 0.50;
        this.speed = 6;

        // Animation
        this.action = false;
        this.walkTimer = 0;                      // Used for animating walk
        this.facing = "right";
        this.flipW = false;
        this.sprite_index = 0;
        this.image_index = 0;
        this.sprite_dir = 0;
        this.sprite_dir_list = [0,9,18,27];

        // Dash
        this.dash = false;						// Dash ability
        this.dashSpeed = 10;					// Default= 15
        this.dashLength = 10;					// Default= 5
        this.dashCounter = 0;				    // Default= 0
        this.dashCoolCounter = 0;				// Default= 0
        this.dashCooldown = 60 * 3;	            // Default= 60*3

        // Parry
        this.parry = false;
        this.parryTimer = 0;
        this.parryCDTimer =0;
        this.parryCDMax = 60 * 3;	            // Parry cooldown; default= 60*3

        // Attack
        this.attackTimer = 0;
        this.attackFrame = 5;
        this.attack = false;
        this.attackType	= -1;
        this.promptContinueAttacking = false;
        this.startCombo	= false;

        // Delay
        this.delayTimer  = 0;
        this.delay =false;
    }

    // Stop dashing
    StopDashing () {
        // Reset dash timers
        //this.dash               = false;
        //this.dashCounter 	    = 0;
        //this.dashCoolCounter    = this.dashCooldown;
    }

    // Dash abiity
    ActivateDash() {
        // If Dash is not on cool down
        if (this.dashCoolCounter <= 0 && this.dashCounter <=0 && !this.attack) {

            // Make sure we are not parrying before dashing
            // Because we dont want to stop the animation of parrying
            // if we dash.
            if (!this.parry) {

                // If doing an action
                if (!this.action) {
                    this.action = true;
                    this.dash = true;
                    this.dashCounter = this.dashLength;

                    // Depending on which way the player is moving;
                    if (this.moveLeft) {
                        this.vX -= this.dashSpeed;
                    }else if (this.moveRight) {
                        this.vX += this.dashSpeed;
                    }
                    if (this.moveUp) {
                        this.vY -= this.dashSpeed;
                    }else if (this.moveDown) {
                        this.vY += this.dashSpeed;
                    }

                    // Play SFX
                    this.sDash.play();
                }
            }
        }
    };

    // Attack ability
    SlashAttack ()
    {

        if (!this.delay) {
            if (!this.attack && !this.stunned && !this.parry) {

                // If doing nothing
                if (!this.action) {
                    this.action = true;

                    // If attacking on certain attack; prompt to continue to a combo
                    if (this.attackType == 0 || this.attackType == 1)
                    {
                        // For combos
                        this.promptContinueAttacking = true;
                    }

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
        }
    };

    Update (mouse, map) {

        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        //--------------------------------- Facing Mouse ----------------------------------//
        
        // Get player angle based on mouse coordinates
        if (this.ControlsPreference == 1) {

            var bmx = this.x+this.w/2;
            var bmy = this.y+this.h/2;

            var bmx2 = mouse.mex;
            var bmy2 = mouse.mey;

            this.angle = Math.atan2(bmy2 - bmy, bmx2 - bmx);
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
        
        // If sprinting; change max movement speed
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
                        //this.facing = "left";
                        //this.sprite_dir = this.sprite_dir_list[3];
                        //this.angle = 180.0;
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
                        //this.facing = "right";
                        //this.sprite_dir = this.sprite_dir_list[2];
                        //this.angle = 0.0;
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
                        //this.facing = "up";
                        //this.sprite_dir = this.sprite_dir_list[1];
                        //this.angle = 270.0;
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
                    // this.facing = "down";
                    // this.sprite_dir = this.sprite_dir_list[0];
                        //this.angle = 90.0;
                // }
                }
            }
        }

        // Apply movement
        this.x += this.vX;
        this.y += this.vY;

        // Mouse controls
        
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

        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        //-------------------------------- Stop Movement ---------------------------------//
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
        //-------------------------------- Stop Movement ---------------------------------//
        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////

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

        // If doing an action
        if (this.action)
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
                else if (this.ashCounter >= 4 && this.dashCounter < 6) {
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
                p_dummy.spawnParticleAngle(particle; 3; 2;
                                    newX-rands/2;
                                    newY-rands/2;
                                rands; rands;
                                0; randDouble(0.1; 0.3);
                                0.0; 0; 0;
                                {255; 255; 255; 255}; 1;
                                1; 1;
                                rand() % 100 + 150; rand() % 2 + 5;
                                rand() % 50 + 90; 0;
                                true; 0.11;
                                rand() % 9 + 2; 1);*/

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

                    // Stop action
                    this.action = false;

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

                        // If User presses to attack within X amount of time; continue attack
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
                                //this.SpawnAttackObject(obj; object);
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

                                // Stop action
                                this.action = false;

                                //this.initialshot = false;
                            }
                        }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////////////
                    //---------------------------------------------------------------------------------------//
                    //--------------------------------------- Attack 2 --------------------------------------//

                    // If attack-type= Slash Attack
                    if (this.attackType == 1)
                    {
                        // Increase attack timer/frames
                        this.attackTimer += this.atkAnimSpe;

                        // If User presses to attack within X amount of time; continue attack
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
                                //this.SpawnAttackObject(obj; object);
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

                                // Stop action
                                this.action = false;

                                //this.initialshot = false;
                            }
                        }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////////////
                    //---------------------------------------------------------------------------------------//
                    //--------------------------------------- Attack 3 --------------------------------------//

                    // If attack-type= Slash Attack
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
                                //this.SpawnAttackObject(obj; object);
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

                            // Stop action
                            this.action = false;

                            //this.initialshot = false;
                        }
                    }
                }
            }

            ///////////////////////////////////////////////////////////////////////////
            //-----------------------------------------------------------------------//
            //------------------------------ Do Parrying ----------------------------//
            // Parrying animation
            else if (this.parry)
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
                if (this.parryTimer > this.parryLength)
                {
                    this.parryTimer = 0;
                    this.parry = false;

                    // Stop action
                    this.action = false;
                }
            }
            //------------------------------ Do Parrying ----------------------------//
            //-----------------------------------------------------------------------//
            ///////////////////////////////////////////////////////////////////////////
        } 
        
        // If NOT doing an action
        else {
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
                                p_dummy.spawnParticleAngle(particle; 3; 2;
                                                    spawnX-randSize/2;
                                                    spawnY-randSize/2;
                                                    randSize; randSize;
                                                    tempAngel; randDouble(0.1; 0.4);
                                                    0.0; 0; 0;
                                                    {255; 255; 255; 255}; 1;
                                                    1; 1;
                                                    rand() % 100 + 150; rand() % 2 + 5;
                                                    rand() % 50 + 90; 0;
                                                    true; randDouble(0.1; 0.7);
                                                    100; 10);

                                // Play sound effect
                                Mix_PlayChannel(-1; settings->sStep; 0);
                            }
                        }
                    }*/
                    //--------------------------- Do walkTimerVFX ---------------------------//
                    //-----------------------------------------------------------------------//
                    ///////////////////////////////////////////////////////////////////////////
                //}
            }
        }


        ///////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        //------------------------ Handle Attack Cooldown -----------------------//
        // Start delay after attacking
        if (this.delay)
        {
            // Start delay (the faster the attakc speed; the sooner the delay ends
            this.delayTimer += this.meleeAtkSpeed;

            // Delay over
            if (this.delayTimer > 60)
            {
                // Stop delay
                this.delayTimer = 0;
                this.delay = false;
            }
        }
        //------------------------ Handle Attack Cooldown -----------------------//
        ///////////////////////////////////////////////////////////////////////////
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


        ///////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        //------------------------ Handle Parry Cooldown ------------------------//
        // Parry cool-down
        if (!this.parry) {
            if (this.parryCDTimer > 0) {
                this.parryCDTimer -= 1;
            }
        }

        //------------------------ Handle Parry Cooldown ------------------------//
        ///////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////

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