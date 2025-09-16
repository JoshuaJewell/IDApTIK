import * as ex from 'excalibur';
import { blockSprite } from './resources';
import BaseActor from './baseactor';
import { Baddie } from './baddie';
import { Floor } from './floor';

const MAX_LIFETIME = 400;

export class Projectile extends BaseActor {
    timeAlive: number = 0;
    constructor(x: number, y: number, direction: number) {
        super({
            name: 'Projectile',
            pos: new ex.Vector(x, y),
            collisionType: ex.CollisionType.Active,
            collisionGroup: ex.CollisionGroupManager.groupByName("player"),
            collider: ex.Shape.Box(1, 1, ex.Vector.Half, ex.vec(0, 0))
        });
        this.vel = new ex.Vector(800 * direction, 0);
    }

    onInitialize(engine: ex.Engine): void {
        this.graphics.use(blockSprite);
    }

    onPostCollision(evt: ex.PostCollisionEvent): void {
        // Add a check to ensure evt.other.owner exists and is of type Baddie
        if (evt.other.owner instanceof Baddie) {
            this.timeAlive += 200; // Fixed typo
        }
    }

    // Update the projectile's position and handle lifetime
    onPreUpdate(engine: ex.Engine, delta: number): void {
        // Check for out-of-bounds or max lifetime
        if (this.pos.x < 0 || this.pos.x > engine.drawWidth || this.timeAlive > MAX_LIFETIME) {
            this.kill();
        }
        this.timeAlive += delta;
    }
}
