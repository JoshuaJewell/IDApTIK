import * as ex from 'excalibur';
import { baddieSpriteSheet, Resources } from "./resources";
import { Player } from './player';
import BaseActor from './baseactor';
let player:Player = new Player(0, 0);

export class Baddie extends BaseActor {
    constructor(x: number, y: number, public dir: number) {
        super({
            name: 'Baddie',
            pos: new ex.Vector(x, y),
            collisionGroup: ex.CollisionGroupManager.groupByName("enemy"),
            collisionType: ex.CollisionType.Active,
            collider: ex.Shape.Box(32, 50, ex.Vector.Half, ex.vec(0, -1)) 
        });
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Initialize actor

        // Setup visuals
        this.createAnimationPair("walk", baddieSpriteSheet, [2, 3, 4, 5], 100);

        // Register animation
        this.graphics.use("walkleft");

        // Setup patroling behavior

        // For the test harness to be predicable
        if (!(window as any).__TESTING) {
            this.actions.delay(1000)
                        .repeatForever(ctx => ctx
                            .moveBy(400 * this.dir, 0, 100)
                            .moveBy(-400 * this.dir, 0, 100));
        }

        // Handle being stomped by the player
        this.on('postcollision', (evt) => this.onPostCollision(evt));
    }

    onPostCollision(evt: ex.PostCollisionEvent) {
        if (evt.other instanceof Player && evt.other.isAttacking()) {
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

    // Change animation based on velocity 
    onPostUpdate() {
        if (this.vel.x < 0) {
            this.graphics.use("walkright");
        } else if (this.vel.x > 0) {
            this.graphics.use("walkleft");
        }
    }
    
}