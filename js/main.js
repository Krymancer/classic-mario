import Timer from './Timer.js';
import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerControler from './traits/PlayerController.js';

import {setupKeyboard} from './input.js';
import {createLevelLoader} from './loaders/level.js';
import {loadEntities} from './entities.js';
import {createCollisionLayer} from './layers/collision.js';
import {loadFont} from './loaders/font.js';
import {createDashboardLayer} from './layers/dashboard.js';

function createPlayerEnvironment(playerEntity) {
  const playerEnvironment = new Entity();
  const playerController = new PlayerControler();
  playerController.checkpoint.set(64, 64);
  playerController.setPlayer(playerEntity);
  playerEnvironment.addTrait(playerController);

  return playerEnvironment;
}

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

  const player = entityFactory.player();
  const playerEnvironment = createPlayerEnvironment(player);
  level.entities.add(playerEnvironment);

  level.compositor.layers.push(createCollisionLayer(level));
  level.compositor.layers.push(createDashboardLayer(font, playerEnvironment));

  const input = setupKeyboard(player);
  input.listen(window);

  const gameContext = {
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
