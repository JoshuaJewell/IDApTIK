import * as ex from 'excalibur';
import { botSpriteSheet, Resources, newBotSpriteSheet } from './resources';
import { Baddie } from './baddie';

export class Bot extends ex.Actor {
    public onGround = true;
    public jumped = false;
    public hurt = false;
    public xvel = 0;
    public facing = 1;
    public animstate = 0;
    public hurtTime: number = 0;
    constructor(x: number, y: number) {
        super({
            name: 'Bot',
            pos: new ex.Vector(x, y),
            collisionType: ex.CollisionType.Active,
            collisionGroup: ex.CollisionGroupManager.groupByName("player"),
            collider: ex.Shape.Box(32, 50, ex.Vector.Half, ex.vec(0, 3))
        });
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Initialize actor

        // Legacy visuals
        const hurtleft = ex.Animation.fromSpriteSheet(botSpriteSheet, [0, 1, 0, 1, 0, 1], 150);
        hurtleft.scale = new ex.Vector(2, 2);
        hurtleft.flipHorizontal = true;

        const hurtright = ex.Animation.fromSpriteSheet(botSpriteSheet, [0, 1, 0, 1, 0, 1], 150);
        hurtright.scale = new ex.Vector(2, 2);

        // New visuals
        const idleright = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [0, 1, 8, 9, 8, 1], 200);
        idleright.scale = new ex.Vector(2, 2);

        const idleleft = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [0, 1, 8,9, 8, 1], 200);
        idleleft.scale = new ex.Vector(2, 2);
        idleleft.flipHorizontal = true;

        const right = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [16, 17, 18, 19], 100);
        right.scale = new ex.Vector(2, 2);

        const left = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [16, 17, 18, 19], 100);
        left.scale = new ex.Vector(2, 2);
        left.flipHorizontal = true;

        const sprintright = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [24, 25, 26, 27, 28, 29, 30, 31], 100);
        sprintright.scale = new ex.Vector(2, 2);

        const sprintleft = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [24, 25, 26, 27, 28, 29, 30, 31], 100);
        sprintleft.scale = new ex.Vector(2, 2);
        sprintleft.flipHorizontal = true;

        const crouchright = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [24, 25, 26, 27, 28, 29, 30, 31], 100);
        sprintleft.scale = new ex.Vector(2, 2);

        const crouchleft = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [24, 25, 26, 27, 28, 29, 30, 31], 100);
        sprintleft.scale = new ex.Vector(2, 2);
        sprintleft.flipHorizontal = true;

        /*
        const jumpright = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [40, 41, 42, 43, 44, 45, 46, 47, 48], 100);
        jumpright.scale = new ex.Vector(2, 2);

        const jumpleft = ex.Animation.fromSpriteSheet(newBotSpriteSheet, [40, 41, 42, 43, 44, 45, 46, 47, 48], 100);
        jumpleft.scale = new ex.Vector(2, 2);
        jumpleft.flipHorizontal = true;
        */

        // Register animations with actor
        this.graphics.add("hurtleft", hurtleft);
        this.graphics.add("hurtright", hurtright);
        this.graphics.add("idleright", idleright);
        this.graphics.add("idleleft", idleleft);
        this.graphics.add("left", left);
        this.graphics.add("right", right);
        this.graphics.add("sprintleft", sprintleft);
        this.graphics.add("sprintright", sprintright);

        //this.graphics.add("jumpleft", jumpleft);
        //this.graphics.add("jumpright", jumpright);

        // onPostCollision is an event, not a lifecycle meaning it can be subscribed to by other things
        this.on('postcollision', (evt) => this.onPostCollision(evt));
    }

    onPostCollision(evt: ex.PostCollisionEvent) {
        // Bot has collided with it's Top of another collider
        console.log(evt.other.name);
        if (evt.side === ex.Side.Bottom) {
            this.onGround = true;
        }

        // Bot has collided on the side, display hurt animation
        if ((evt.side === ex.Side.Left ||
             evt.side === ex.Side.Right) &&
            evt.other instanceof Baddie) {
            if (this.vel.x < 0 && !this.hurt) {
                this.graphics.use("hurtleft");
            } 
            if (this.vel.x >= 0 && !this.hurt) {
                this.graphics.use("hurtright");
            }
            this.hurt = true;
            this.hurtTime = 1000;
            Resources.hit.play(.1);
        }
    }

    // After main update, once per frame execute this code
    onPreUpdate(engine: ex.Engine, delta: number) {
        // If hurt, count down
        if (this.hurtTime >= 0 && this.hurt) {
            this.hurtTime -= delta;
            if (this.hurtTime < 0) {
                this.hurt = false;
            }
        }

        // Reset vars
        this.xvel = 0;
        this.animstate = 0;

        // Player input
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
            this.xvel += 150;
            this.facing = 1;
        }
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
            this.xvel += -150;
            this.facing = 0;
        }
        if(engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
            this.xvel *= 0.5;
        }
        else if (engine.input.keyboard.isHeld(ex.Input.Keys.ShiftLeft)) {
            this.xvel *= 2;
        }
        this.vel.x = this.xvel;

        if(engine.input.keyboard.isHeld(ex.Input.Keys.Up) && this.onGround) {
            this.vel.y = -400;
            this.onGround = false;
            Resources.jump.play(.1);
        }

        

        switch (Math.abs(this.xvel) + this.facing) {
            case 0: {
                this.graphics.use("idleleft");
                break;
            }
            case 1: {
                this.graphics.use("idleright");
                break;
            }
            case 150: {
                this.graphics.use("left");
                break;
            }
            case 151: {
                this.graphics.use("right");
                break;
            }
            case 300: {
                this.graphics.use("sprintleft");
                break;
            }
            case 301: {
                this.graphics.use("sprintright")
            }
        }




        /*
        // Change animation based on velocity
        if (this.vel.x < 0 && !this.hurt) {
            this.graphics.use("left");
        } 
        if (this.vel.x > 0 && !this.hurt) {
            this.graphics.use("right");
        }
        if (this.xvel < -160 && !this.hurt) {
            this.graphics.use("sprintleft");
        } 
        if (this.vel.x > 160 && !this.hurt) {
            this.graphics.use("sprintright");
        } 
        if (this.vel.x === 0 && !this.hurt){
            if (this.facing === 1) {
                this.graphics.use("idleright");
            }
            else {
                this.graphics.use("idleleft")
            }
        }
    
        // Change animation based on crouch state
        if (this.crouching) {
            
        }
        */
    }
}