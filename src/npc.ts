import * as ex from 'excalibur';
import { playerRedSpriteSheet, Resources, npcSprite } from './resources';
import { Player } from './player';
let player:Player = new Player(0, 0);

export class NPC extends ex.Actor {
    public onGround = true;
    public hurt = false;
    public hurtTime: number = 0;
    constructor(x: number, y: number) {
        super({
            pos: new ex.Vector(x, y),
            collisionType: ex.CollisionType.Active,
            collisionGroup: ex.CollisionGroupManager.groupByName("neutral"),
            collider: ex.Shape.Box(32, 50, ex.Vector.Half, ex.vec(0, 3))
        });
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Initialize actor

        // Set the z-index to be behind everything
        this.z = -1;

        // Setup visuals
        const hurtleft = ex.Animation.fromSpriteSheet(playerRedSpriteSheet, [0, 1, 0, 1, 0, 1], 150);
        hurtleft.scale = new ex.Vector(2, 2);

        const hurtright = ex.Animation.fromSpriteSheet(playerRedSpriteSheet, [0, 1, 0, 1, 0, 1], 150);
        hurtright.scale = new ex.Vector(2, 2);
        hurtright.flipHorizontal = true;

        const idle = ex.Animation.fromSpriteSheet(playerRedSpriteSheet, [2, 3], 800);
        idle.scale = new ex.Vector(2, 2);

        const left = ex.Animation.fromSpriteSheet(playerRedSpriteSheet, [3, 4, 5, 6, 7], 100);
        left.scale = new ex.Vector(2, 2);

        const right = ex.Animation.fromSpriteSheet(playerRedSpriteSheet, [3, 4, 5, 6, 7], 100);
        right.scale = new ex.Vector(2, 2);
        right.flipHorizontal = true;

        // Register drawings
        this.graphics.add("hurtleft", hurtleft);
        this.graphics.add("hurtright", hurtright);
        this.graphics.add("idle", idle);
        this.graphics.add("left", left);
        this.graphics.add("right", right);

        // Setup patroling behavior

        // For the test harness to be predicable
        if (!(window as any).__TESTING) {
            this.actions.delay(1000)
                        .repeatForever(ctx => ctx
                            .moveBy(100, 0, 20)
                            .moveBy(-100, 0, 20));
        }


        // Custom draw after local tranform, draws word bubble
        this.graphics.onPostDraw = (ctx) => {
            npcSprite.draw(ctx, -10, -100);
        }

        this.on('postcollision', (evt) => this.onPostCollision(evt));
    }

    onPostCollision(evt: ex.PostCollisionEvent) {
        if (evt.other instanceof Player && (evt.other.isAttacking())) {
            Resources.gotEm.play(.1);
            // Clear patrolling
            this.actions.clearActions();
            // Remove ability to collide
            this.body.collisionType = ex.CollisionType.PreventCollision;

            // Launch into air with rotation
            this.vel = new ex.Vector(0, -300);
            this.acc = ex.Physics.acc;
            this.angularVelocity = 2;
        }
    }

    onPostUpdate(engine: ex.Engine, delta: number) {
        if (this.vel.x < 0) {
            this.graphics.use("left");
        }
        if (this.vel.x > 0) {
            this.graphics.use("right");
        }
        if (this.vel.x === 0) {
            this.graphics.use("idle")
        }
    }
}