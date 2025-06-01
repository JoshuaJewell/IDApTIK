import * as ex from 'excalibur';
import { ExcaliburGraphicsContext } from 'excalibur';
import { blockSprite } from './resources';

export class Floor extends ex.Actor {
    constructor(x: number, y: number, public cols: number, public rows: number) {
        super({
            name: 'Floor',
            pos: new ex.Vector(x, y),
            scale: new ex.Vector(2, 2),
            anchor: ex.Vector.Zero,
            collider: ex.Shape.Box(20 * cols, 15 * rows, ex.Vector.Zero),
            collisionType: ex.CollisionType.Fixed,
            collisionGroup: ex.CollisionGroupManager.groupByName("floor"),
        });

        const graphicsGroup = new ex.GraphicsGroup({
            members: Array.from({ length: cols * rows }, (_, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            return {
                offset: ex.vec(col * blockSprite.width, row * blockSprite.height),
                graphic: blockSprite,
                };
            }),
        });
        
        this.graphics.use(graphicsGroup);
    }
}
