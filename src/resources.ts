import * as ex from 'excalibur';

const playerFile = require('../res/HPCHAR.png');
const playerRedFile = require('../res/excalibot-red.png');
const baddieFile = require('../res/baddie.png');
const blockFile = require('../res/block.png');
const npcFile = require('../res/npc.png');

const levelSTIntro = require('../res/BreakbeatSax-intro.wav')
const levelSTLoop = require('../res/BreakbeatSax-loop.wav')
const jumpSound = require('../res/jump.wav');
const hitSound = require('../res/hurt.wav');
const gotEmSound = require('../res/gottem.wav');

const Resources = {
    player: new ex.ImageSource(playerFile),
    playerRed: new ex.ImageSource(playerRedFile),
    baddie: new ex.ImageSource(baddieFile),
    block: new ex.ImageSource(blockFile),
    npc: new ex.ImageSource(npcFile),
    
    levelSTIntro: new ex.Sound(levelSTIntro),
    levelSTLoop: new ex.Sound(levelSTLoop),
    jump: new ex.Sound(jumpSound),
    hit: new ex.Sound(hitSound),
    gotEm: new ex.Sound(gotEmSound),
}

const loader = new ex.Loader();

const playerRedSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Resources.playerRed,
    grid: {
        columns: 8, 
        rows: 1,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
const baddieSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Resources.baddie,
    grid: {
        columns: 6, 
        rows: 1,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
const playerSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Resources.player,
    grid: {
        columns: 8,
        rows: 9,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
const blockSprite = Resources.block.toSprite();
const npcSprite = Resources.npc.toSprite();

for (const res in Resources) {
    loader.addResource((Resources as any)[res]);
}

export { Resources, loader, playerSpriteSheet, playerRedSpriteSheet, baddieSpriteSheet, blockSprite, npcSprite }