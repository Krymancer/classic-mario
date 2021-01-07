import Timer from './Timer.js';
import Camera from './Camera.js';

import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';
import {createLevelLoader} from './loaders/level.js';
import {createPlayer, createPlayerEnvironment} from './player.js';
import {loadEntities} from './entities.js';
import {loadFont} from './loaders/font.js';
import {setupKeyboard} from './input.js';

async function main(canvas) {
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const player = createPlayer(entityFactory.player());
  const playerEnvironment = createPlayerEnvironment(player);
  level.entities.add(playerEnvironment);

  level.compositor.layers.push(createCollisionLayer(level));
  level.compositor.layers.push(createDashboardLayer(font, playerEnvironment));

  const input = setupKeyboard(player);
  input.listen(window);

  const gameContext = {
    entityFactory,
    audioContext,
    deltaTime: null,
  };

  const timer = new Timer();
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    level.update(gameContext);

    camera.pos.x = Math.max(0, player.pos.x - 100);

    level.compositor.draw(context, camera);
  };

  timer.start();
}

const canvas = document.getElementById('game');
main(canvas);
