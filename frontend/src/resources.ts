// frontend/src/resources.ts
import * as ex from 'excalibur';

// Use absolute paths (Vite serves from /public)
const Resources = {
  player: new ex.ImageSource('/res/HPCHAR.png'),
  playerRed: new ex.ImageSource('/res/excalibot-red.png'),
  baddie: new ex.ImageSource('/res/baddie.png'),
  block: new ex.ImageSource('/res/block.png'),
  npc: new ex.ImageSource('/res/npc.png'),
  
  levelSTIntro: new ex.Sound('/res/BreakbeatSax-intro.wav'),
  levelSTLoop: new ex.Sound('/res/BreakbeatSax-loop.wav'),
  jump: new ex.Sound('/res/jump.wav'),
  hit: new ex.Sound('/res/hurt.wav'),
  gotEm: new ex.Sound('/res/gottem.wav'),
};

const loader = new ex.Loader();

// Create sprite sheets
const playerRedSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.playerRed,
  grid: { columns: 8, rows: 1, spriteWidth: 32, spriteHeight: 32 }
});

const baddieSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.baddie,
  grid: { columns: 6, rows: 1, spriteWidth: 32, spriteHeight: 32 }
});

const playerSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.player,
  grid: { columns: 8, rows: 9, spriteWidth: 32, spriteHeight: 32 }
});

const blockSprite = Resources.block.toSprite();
const npcSprite = Resources.npc.toSprite();

// Add all resources to loader
Object.values(Resources).forEach(res => loader.addResource(res));

export { 
  Resources, 
  loader, 
  playerSpriteSheet, 
  playerRedSpriteSheet, 
  baddieSpriteSheet, 
  blockSprite, 
  npcSprite 
};