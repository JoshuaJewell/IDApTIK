import * as ex from 'excalibur';
import { Baddie } from './baddie';
import { Bot } from './bot';
import { Floor } from './floor';
import { NPC } from './npc';
import { Resources } from './resources';

export class Level extends ex.Scene {
    constructor() {
        super();
    }

    onInitialize(engine: ex.Engine) {

        // Create collision groups for the game
        ex.CollisionGroupManager.create("player");
        ex.CollisionGroupManager.create("enemy");
        ex.CollisionGroupManager.create("floor");

        // Compose actors in scene
        const actor = new Bot(engine.halfDrawWidth + 100, engine.halfDrawHeight - 100);

        const baddie = new Baddie(engine.halfDrawWidth - 200, 300 - 30, 1);
        const baddie2 = new Baddie(engine.halfDrawWidth + 200, 300 - 30, -1);

        const npc = new NPC(engine.halfDrawWidth + 100, engine.halfDrawHeight - 100);
        
        const floor = new Floor(0, 300, 18, 1);
        const otherFloor = new Floor(engine.halfDrawWidth + 50, 200, 5, 1);

        engine.add(actor);
        engine.add(npc);
        engine.add(baddie);
        engine.add(baddie2);
        engine.add(floor);
        engine.add(otherFloor);

        Resources.levelSTLoop.loop = true;
        Resources.levelSTIntro.play();
        if (Resources && Resources.levelSTIntro && Resources.levelSTIntro.duration) { // Undefined check...I hate TS
            const duration = (Resources.levelSTIntro.duration * 1000);
            setTimeout(() => {
                Resources.levelSTLoop.play();
            }, duration);
        }

        // For the test harness to be predicable
        if (!(window as any).__TESTING) {
            // Create camera strategy
            this.camera.clearAllStrategies();
            this.camera.strategy.elasticToActor(actor, 0.05, 0.1);
        }
    }
}