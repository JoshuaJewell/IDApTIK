import * as ex from 'excalibur';
import { blockSprite } from './resources';
import BaseActor from './baseactor';

export class Projectile extends BaseActor {
    constructor(x: number, y: number, direction: number) {
        super({
            name: 'Projectile',
            pos: new ex.Vector(x, y),
            collisionType: ex.CollisionType.Active,
            collisionGroup: ex.CollisionGroupManager.groupByName("player"),
            collider: ex.Shape.Box(1, 1, ex.Vector.Half, ex.vec(0, 0))
        });

        this.vel = new ex.Vector(400 * direction, 0);
    }

    timeAlive = 0;

    onInitialize(engine: ex.Engine) {
        this.graphics.use(blockSprite);
    }

    onPostCollision(evt: ex.PostCollisionEvent) {
        
    }

    // Update the projectile's position
    onPreUpdate(engine: ex.Engine, delta: number) {
        if (this.pos.x < 0 || this.pos.x > engine.drawWidth || this.timeAlive > 200) {
            this.kill();
        }
        this.timeAlive += 1;
  }
}
