import * as ex from 'excalibur';

export class Projectile extends ex.Actor {
  private damage: number;

  constructor(x: number, y: number, damage: number) {
    super({
      name: 'Projectile',
      pos: new ex.Vector(x, y),
      collisionType: ex.CollisionType.Active,
      collider: ex.Shape.Circle(5),
    });

    this.damage = damage;
  }

  public update(engine: ex.Engine, delta: number) {
    this.vel.y += 100 * delta;
  }
}