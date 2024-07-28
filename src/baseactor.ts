import { Actor, Animation, Vector } from 'excalibur';

class BaseActor extends Actor {
    createAnimation(
      name: string,
      spriteSheet: ex.SpriteSheet,
      frames: number[],
      speed: number,
      scale: ex.Vector = new Vector(2, 2),
      flipHorizontal: boolean = false
    ): void {
      const animation = Animation.fromSpriteSheet(spriteSheet, frames, speed);
      animation.scale = scale;
      if (flipHorizontal) {
        animation.flipHorizontal = true;
      }
      this.graphics.add(name, animation);
    }
  
    createAnimationPair(
      name: string,
      spriteSheet: ex.SpriteSheet,
      frames: number[],
      speed: number,
      scale: ex.Vector = new Vector(2, 2)
    ): void {
      this.createAnimation(`${name}right`, spriteSheet, frames, speed, scale);
      this.createAnimation(`${name}left`, spriteSheet, frames, speed, scale, true);
    }
}

export default BaseActor;