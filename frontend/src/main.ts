import * as ex from 'excalibur';
import { loader } from './resources';
import { Level } from './level';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const engine = new ex.Engine({
    canvasElement: canvas,
    backgroundColor: ex.Color.fromHex('#efefef'),
    width: 600,
    height: 400,
    fixedUpdateFps: 60,
    antialiasing: false,
    physics: {
      solver: ex.SolverStrategy.Arcade,
      gravity: ex.vec(0, 800),
      arcade: {
        contactSolveBias: ex.ContactSolveBias.VerticalFirst
      },
    }
  });

  const level = new Level();
  engine.add('level', level);
  engine.goToScene('level');

  // Handle window visibility
  engine.on('hidden', () => {
    console.log('pause');
    engine.stop();
  });
  engine.on('visible', () => {
    console.log('start');
    engine.start();
  });

  // Start the game
  engine.start(loader).then(() => {
    console.log('Game started');
  }).catch(err => {
    console.error('Failed to start game:', err);
  });

  // Debug
  (window as any).engine = engine;
  (window as any).level = level;
});
