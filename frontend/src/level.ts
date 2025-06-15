// frontend/src/level.ts
import * as ex from 'excalibur';
import { Baddie } from './baddie';
import { Player } from './player';
import { Floor } from './floor';
import { NPC } from './npc';
import { Resources } from './resources';

export class Level extends ex.Scene {
  constructor() {
    super();
  }

  onInitialize(engine: ex.Engine) {
    // Collision groups
    ex.CollisionGroupManager.create("player");
    ex.CollisionGroupManager.create("neutral");
    ex.CollisionGroupManager.create("enemy");
    ex.CollisionGroupManager.create("floor");

    // Actors
    const player = new Player(engine.halfDrawWidth + 100, engine.halfDrawHeight - 100);
    const hostile = new Baddie(engine.halfDrawWidth - 200, 300 - 30, 1);
    const hostile2 = new Baddie(engine.halfDrawWidth + 200, 300 - 30, -1);
    const npc = new NPC(engine.halfDrawWidth + 100, engine.halfDrawHeight - 100);
    const floor = new Floor(0, 300, 18, 1);
    const otherFloor = new Floor(engine.halfDrawWidth + 50, 200, 5, 1);

    [player, npc, hostile, hostile2, floor, otherFloor].forEach(ent => engine.add(ent));

    // Music
    Resources.levelSTLoop.loop = true;
    Resources.levelSTIntro.play().catch(err => console.error('Intro sound failed:', err));
    
    if (Resources.levelSTIntro.duration) {
      const duration = (Resources.levelSTIntro.duration * 1000);
      setTimeout(() => Resources.levelSTLoop.play(), duration);
    }

    // Camera
    if (!(window as any).__TESTING) {
      this.camera.clearAllStrategies();
      this.camera.strategy.elasticToActor(player, 0.05, 0.1);
    }
  }
}