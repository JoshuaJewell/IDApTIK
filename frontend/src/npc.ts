import * as ex from 'excalibur';
import { playerRedSpriteSheet, Resources, npcSprite } from './resources';
import { Player } from './player';
import BaseActor from './baseactor';
let player:Player = new Player(0, 0);

export class NPC extends BaseActor {
    private onGround = true;
    private hurt = false;
    private hurtTime: number = 0;
    private facing = 1;

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

        this.z = -1;

        // Setup visuals
        this.createAnimationPair("walk", playerRedSpriteSheet, [3, 4, 5, 6, 7], 100);
        this.createAnimationPair("hurt", playerRedSpriteSheet, [0, 1, 0, 1, 0, 1], 150);
        this.createAnimationPair("idle", playerRedSpriteSheet, [2, 3], 800);

        // Register animation
        this.graphics.use("idleleft");

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
            this.graphics.use("walkright");
            this.facing = 1;
        }
        if (this.vel.x > 0) {
            this.graphics.use("walkleft");
            this.facing = 2;
        }
        if (this.vel.x == 0) {
            if (this.facing == 1) {
                this.graphics.use("idleright")
            }
            else {
            this.graphics.use("idleleft")
            }
        }
    }
}