import * as ex from 'excalibur';
import { playerSpriteSheet, Resources } from './resources';
import { Baddie } from './baddie';
import BaseActor from './baseactor';

export class Player extends BaseActor {
    // Gameplay constants
    private static readonly HURT_TIME = 1000; // Legacy
    private static readonly FRICTION = 0.75;
    private static readonly FRICTION_THRESHOLD = 0.05; // Stop character completely when xvel is lower than this value
    private static readonly SPEED_MULT = 1.6;
    private static readonly MAXJMP_MULT = 5;
    private static readonly JMPACC_MULT = 0.1;
    private static readonly CROUCH_MULT = 0.5;
    private static readonly SPRINT_MULT = 2;
    private static readonly DISPLACEMENT_DIVISOR = 100; // Lower values increase sensitivity of cursor-Player displacement on jump speed

    // Graphics constants, may need to be adjustable in future settings menu
    private static readonly ATTACK_FRAMES = 42; // For animation
    private static readonly TRAJ_LENGTH = 500; // Lower values are longer
    private static readonly T_INC = 0.06; // Frequency of trajpoints, <0.02 has significant performance issues
    private static readonly TRAJPOINTS_DIVISOR = Player.T_INC * Player.TRAJ_LENGTH; 
    private static readonly MIN_POINT_THICKNESS = 2.75; // Not actual minimum, it was at some stage before the drawing formula was updated, I suspect actual minimum at POINT_THICKNESS difference of 0.75 is ~1.5
    private static readonly MAX_POINT_THICKNESS = 3.5; // Not actual maximum, it was at some stage before the drawing formula was updated, I suspect actual maximum at POINT_THICKNESS difference of 0.75 is ~4
    private static readonly POINT_FLICKER_SPEED = 0.1; // Higher values increase flicker
    private static readonly G = 400; // Gravitational constant, empirical
    private static readonly ANGLE_JMPLIM_E = Math.PI / 4; // South-East, needs increasing
    private static readonly ANGLE_JMPLIM_W = 3 * Math.PI / 4; // South-West, needs decreasing

    // Gameplay variables
    private onGround = true;
    private hurt = false;
    private facing = 1; // 1 Left, 2 Right, (-1 Leftdown, -2 Rightdown - legacy)
    private hurtTime = 0;
    private attacking = 0;
    private jumpPotential = 0;

    // Gameplay methods
    public isAttacking(): boolean {
        return this.attacking > 0;
    }

    // Graphics variables
    private timeAlive = 0; // Increments every PreUpdate, currently only for trajpoint flicker effect
    private trajectoryActors: ex.Actor[] = []; // Array to store trajectory actors to kill

    // Attribute variables, will likely be held outside player.ts at some point
    public str = 100;
    public dex = 100;
    public con = 100;
    public int = 100;
    public wil = 100;
    public cha = 100;


    // Hitbox instantiation
    constructor(x: number, y: number) {
        super({
            name: 'Player',
            pos: new ex.Vector(x, y),
            collisionType: ex.CollisionType.Active,
            collisionGroup: ex.CollisionGroupManager.groupByName("player"),
            collider: ex.Shape.Box(32, 50, ex.Vector.Half, ex.vec(0, 3))
        });
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Register all animations
  
        // Legacy
        this.createAnimationPair("hurt", playerSpriteSheet, [0, 1, 0, 1, 0, 1], 150);

        // New
        this.createAnimationPair("idle", playerSpriteSheet, [0, 1, 8, 9, 8, 1], 200);
        this.createAnimationPair("walk", playerSpriteSheet, [16, 17, 18, 19], 100);
        this.createAnimationPair("crouch", playerSpriteSheet, [34, 35, 36], 200);
        this.createAnimationPair("sprint", playerSpriteSheet, [24, 25, 26, 27, 28, 29, 30, 31], 100);
        this.createAnimationPair("attack", playerSpriteSheet, [68, 69, 70, 71, 64, 65, 66, 67], 100);
        this.createAnimationPair("jump", playerSpriteSheet, [40, 41, 42, 43, 44, 45, 46, 47, 48], 100);
   
        // onPostCollision is an event, not a lifecycle meaning it can be subscribed to by other things
        this.on('postcollision', (evt) => this.onPostCollision(evt));
    }

    onPostCollision(evt: ex.PostCollisionEvent) {
        // Player has collided with the Top of another collider
        if (evt.side === ex.Side.Bottom) {
            this.onGround = true;
        }

        // Halt xvel when colliding with a side (improves quality of projectile motion)
        let sideevt = (evt.side === ex.Side.Left) || (evt.side === ex.Side.Right);
        if (sideevt) {
            this.vel.x = 0;
        }

        // Player collision with enemy, display hurt animation (epistasis)
        /*if (sideevt && evt.other instanceof Baddie) {
            if (this.vel.x < 0 && !this.hurt) {
                this.graphics.use("hurtleft");
            } 
            if (this.vel.x >= 0 && !this.hurt) {
                this.graphics.use("hurtright");
            }
            this.hurt = true;
            this.hurtTime = Player.HURT_TIME;
            Resources.hit.play(.1);
        }*/
    }

    // After main update, once per frame execute this code
    onPreUpdate(engine: ex.Engine, delta: number) {
        // If hurt, count down (legacy code, seems this.hurt check is redundant but not ready to mess with yet)
        if (this.hurtTime >= 0 && this.hurt) {
            this.hurtTime -= delta;
            if (this.hurtTime < 0) {
                this.hurt = false;
            }
        }

        // Slow Player to stop
        if (this.onGround) {
            this.vel.x *= Player.FRICTION;
            if (Math.abs(this.vel.x) < Player.FRICTION_THRESHOLD) {
                this.vel.x = 0;
            }
        }

        // Remove trajpoints
        for (const actor of this.trajectoryActors) {
            engine.remove(actor);
        }
        this.trajectoryActors = [];

        // Prepare attribute-influenced motion vars
        let speed = Player.SPEED_MULT * this.dex;
        let jumpacc = Player.JMPACC_MULT * this.dex;
        let maxjump = Player.MAXJMP_MULT * this.str;

        // Player input
        let attackkey = engine.input.keyboard.isHeld(ex.Keys.X);
        let sprintkey = engine.input.keyboard.isHeld(ex.Keys.ShiftLeft);
        let upkey = (engine.input.keyboard.isHeld(ex.Keys.Up) || engine.input.keyboard.isHeld(ex.Keys.W)); // upkey currently for jump, want to replace with mousedown
        let leftkey = (engine.input.keyboard.isHeld(ex.Keys.Left) || engine.input.keyboard.isHeld(ex.Keys.A));
        let crouchkey = (engine.input.keyboard.isHeld(ex.Keys.Down) || engine.input.keyboard.isHeld(ex.Keys.S)) || engine.input.keyboard.isHeld(ex.Keys.ControlLeft);
        let rightkey = (engine.input.keyboard.isHeld(ex.Keys.Right) || engine.input.keyboard.isHeld(ex.Keys.D));

        // Everything but jump, how serene and well laid out and...
        if (attackkey) {
            this.attacking = Player.ATTACK_FRAMES;
        }
        if (this.onGround) {
            this.graphics.use(this.facing == 1 ? "idleleft" : "idleright");
            
            if (leftkey || rightkey) {
                this.vel.x = (leftkey ? -1 : 1) * speed;
                this.facing = leftkey ? 1 : 2;
                this.graphics.use((leftkey ? "walkleft" : "walkright"));

                if (sprintkey) {
                    this.vel.x *= Player.SPRINT_MULT;
                    this.graphics.use(leftkey ? "sprintleft" : "sprintright");
                }
            }
            if (!sprintkey && crouchkey) {
                this.vel.x *= Player.CROUCH_MULT;
                this.graphics.use(this.facing == 1 ? "crouchleft" : "crouchright");
            }
        }


        // ...oh my god what is this??? (Jump)
        if ((upkey || this.jumpPotential > 0) && this.onGround) {
            this.vel.x = 0; // Lock Player position while aiming

            // Find pointer-Player difference
            let relx = engine.input.pointers.primary.lastWorldPos.x - this.getGlobalPos().x;
            let rely = engine.input.pointers.primary.lastWorldPos.y - this.getGlobalPos().y;

            // Determine jump angle (exclude some range below Player)
            let jumpangle = Math.atan2(rely, relx);
            if (jumpangle > Player.ANGLE_JMPLIM_E && jumpangle < Player.ANGLE_JMPLIM_W) {
                if (jumpangle > Math.PI / 2) {
                    jumpangle = Player.ANGLE_JMPLIM_W;
                }
                else {
                    jumpangle = Player.ANGLE_JMPLIM_E;
                }
            }

            // Determine magnitude and velocity of jump based on displacement of pointer 
            let jumpmag = Math.min(this.jumpPotential * (Math.hypot(relx, rely) / Player.DISPLACEMENT_DIVISOR), maxjump);
            let jumpvely = jumpmag * Math.sin(jumpangle);
            let jumpvelx = jumpmag * Math.cos(jumpangle);

            // Match Player facing with mouse facing, apply animation
            this.facing = (0.5 * relx / Math.abs(relx)) + 1.5; // -ve relx = 1 (left), +ve  relx = 2 (right)
            this.graphics.use(this.facing == 1 ? "crouchleft" : "crouchright");

            // Release jump or continue increasing potential
            if (upkey && (this.jumpPotential < maxjump)) {
                this.jumpPotential += jumpacc;
            }
            else if (!upkey && (this.jumpPotential > 0)) {
                this.graphics.use(this.facing == 1 ? "jumpleft" : "jumpright");
                this.vel.y = jumpvely;
                this.vel.x = jumpvelx;
                this.jumpPotential = 0;
                this.onGround = false;
            }

            // Trajectory drawing
            let t = Player.T_INC;
            let trajpoints = Math.round(jumpmag / Player.TRAJPOINTS_DIVISOR);
            for (let i = 0; i < trajpoints; i++) {
                // Find coords on parametric equation
                let trajpointx = (t * jumpvelx);
                let trajpointy = ((t * jumpvely) + (Player.G * (t ** 2)));

                // Render coords
                const lineActor = new ex.Actor({
                    pos: this.getGlobalPos(),
                });
                lineActor.graphics.anchor = ex.Vector.Zero;
                lineActor.z = -1; // Almost creates the illusion that these currently ignore all obstructions
                let pointthickness = (
                    Player.MIN_POINT_THICKNESS +
                    (Player.MAX_POINT_THICKNESS - Player.MIN_POINT_THICKNESS) *
                    (Math.cos(Player.POINT_FLICKER_SPEED * (this.timeAlive - i))) +
                    0.5 * Math.sin(2 * Player.POINT_FLICKER_SPEED * (this.timeAlive - i))
                );
                lineActor.graphics.use(
                    new ex.Line({
                        start: ex.vec(trajpointx, trajpointy - (0.5 * pointthickness)),
                        end: ex.vec(trajpointx, trajpointy + (0.5 * pointthickness)),
                        color: new ex.Color(0, 0, 0, 1 / (i + 1)),
                        thickness: pointthickness,
                    })
                );
                engine.add(lineActor);
                this.trajectoryActors.push(lineActor);
                t += Player.T_INC;
            }
        }

        // Manage attack animation, at end to overwrite any motion animation
        if (this.attacking > 0) {
            this.graphics.use(this.facing === 1 ? "attackleft" : "attackright");
            this.attacking -= 1;
        }

        this.timeAlive += 1;
    }
}