import * as ex from 'excalibur';
import { playerSpriteSheet, Resources } from './resources';
import { Projectile } from './projectile';
import BaseActor from './baseactor';
import { PlayerInput } from './playerInput.ts';

export class Player extends BaseActor {
    // Gameplay constants
    private static readonly FRICTION = 0.75;
    private static readonly FRICTION_THRESHOLD = 0.05; // Stop character completely when xvel is lower than this value
    private static readonly SPEED_MULT = 1.6;
    private static readonly MAXJMP_MULT = 5;
    private static readonly JMPACC_MULT = 0.1;
    private static readonly CROUCH_MULT = 0.5;
    private static readonly SPRINT_MULT = 2;
    private static readonly DISPLACEMENT_DIVISOR = 100; // Lower values increase sensitivity of cursor-Player displacement on jump speed
    private static readonly FIRERATE = 100;

    // Graphics constants, may be good for styling
    private static readonly TRAJ_LENGTH = 50000; // Lower values are longer
    private static readonly T_INC = 0.06; // Frequency of trajpoints, <0.005 begins to look continuous but may cause performance issues
    private static readonly MIN_POINT_THICKNESS = 2.75; // Not actual minimum, it was at some stage before the drawing formula was updated, I suspect actual minimum at POINT_THICKNESS difference of 0.75 is ~1.5
    private static readonly MAX_POINT_THICKNESS = 3.5; // Not actual maximum, it was at some stage before the drawing formula was updated, I suspect actual maximum at POINT_THICKNESS difference of 0.75 is ~4
    private static readonly POINT_FLICKER_SPEED = 0.1; // Higher values increase flicker
    
    // Graphics constants, probably ought to stay as such
    private static readonly ATTACK_FRAMES = 42; // For animation
    private static readonly G = 400; // Gravitational constant, empirical
    private static readonly ANGLE_JMPLIM_E = Math.PI / 4; // South-East, needs increasing
    private static readonly ANGLE_JMPLIM_W = 3 * Math.PI / 4; // South-West, needs decreasing

    // Gameplay variables
    private onGround = true;
    private facing = 1; // 1 Left, 2 Right
    private attacking = 0;
    private jumpPotential = 0;
    private firecooldown = 0;

    // Gameplay methods
    private updateGroundState() {
        this.onGround = this.vel.y === 0;
    }
    private applyFriction() {
        if (this.onGround) {
            this.vel.x *= Player.FRICTION;
            if (Math.abs(this.vel.x) < Player.FRICTION_THRESHOLD) {
                this.vel.x = 0;
            }
        }
    }
    public isAttacking(): boolean {
        return this.attacking > 0;
    }
    private fireProjectile(engine: ex.Engine) {
        const direction = this.facing === 1 ? -1 : 1;
        const projectile = new Projectile(this.pos.x, this.pos.y, direction);
        engine.add(projectile);
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
            collider: ex.Shape.Box(20, 44, ex.Vector.Half, ex.vec(0, 3))
        });
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Register all animations
        this.createAnimationPair("idle", playerSpriteSheet, [0, 1, 2, 3], 200);
        this.createAnimationPair("walk", playerSpriteSheet, [4, 5, 6, 7], 200);
        this.createAnimationPair("sprint", playerSpriteSheet, [4, 5, 6, 7], 100);
        this.createAnimationPair("crouch", playerSpriteSheet, [8], 200);
        this.createAnimationPair("attack", playerSpriteSheet, [12, 13, 14, 15], 100);
        this.createAnimationPair("jump", playerSpriteSheet, [10], 100);
   
        // onPostCollision is an event, not a lifecycle meaning it can be subscribed to by other things
        this.on('postcollision', (evt) => this.onPostCollision(evt));
    }

    onPostCollision(evt: ex.PostCollisionEvent) {
        // Halt xvel when colliding with a side (improves quality of projectile motion)
        let sideevt = (evt.side === ex.Side.Left) || (evt.side === ex.Side.Right);
        if (sideevt) {
            this.vel.x = 0;
        }
    }

    // After main update, once per frame execute this code
    onPreUpdate(engine: ex.Engine, delta: number) {
        this.updateGroundState()
        
        this.applyFriction()

        // Remove trajpoints
        for (const actor of this.trajectoryActors) {
            engine.remove(actor);
        }
        this.trajectoryActors = [];

        // Prepare attribute-influenced motion vars
        let speed = Player.SPEED_MULT * this.dex;                               // Dex increases speed
        let jumpacc = Player.JMPACC_MULT * this.dex;                            // Dex increases jump charge speed
        let maxjump = Player.MAXJMP_MULT * this.str;                            // Str increases jump height
        let trajpointsdivisor = Player.T_INC * Player.TRAJ_LENGTH / this.int;   // Int increases jump trajectory prediction distance

        const input = new PlayerInput(engine);

        if (input.attack) {
            this.attacking = Player.ATTACK_FRAMES;
        }
        if (this.onGround) {
            this.graphics.use(this.facing == 1 ? "idleleft" : "idleright");
            
            if (input.left || input.right) {
                this.vel.x = (input.left ? -1 : 1) * speed;
                this.facing = input.left ? 1 : 2;
                this.graphics.use((input.left ? "walkleft" : "walkright"));

                if (input.sprint) {
                    this.vel.x *= Player.SPRINT_MULT;
                    this.graphics.use(input.left ? "sprintleft" : "sprintright");
                }
            }
            if (!input.sprint && input.crouch) {
                this.vel.x *= Player.CROUCH_MULT;
                this.graphics.use(this.facing == 1 ? "crouchleft" : "crouchright");
            }
        }

        if ((input.up || this.jumpPotential > 0) && this.onGround) {
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
            if (input.up && (this.jumpPotential < maxjump)) {
                this.jumpPotential += jumpacc;
            }
            else if (!input.up && (this.jumpPotential > 0)) {
                this.graphics.use(this.facing == 1 ? "jumpleft" : "jumpright");
                this.vel.y = jumpvely;
                this.vel.x = jumpvelx;
                this.jumpPotential = 0;
            }

            // Trajectory drawing
            let t = Player.T_INC;
            let trajpoints = Math.round(jumpmag / trajpointsdivisor);
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
        if (this.firecooldown > 0) {
            this.firecooldown -= delta;
        }
        else if (input.fire) {
            this.fireProjectile(engine);
            this.firecooldown = Player.FIRERATE;
        }
        

        this.timeAlive += 1;
    }
}