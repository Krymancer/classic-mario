import Timer from './Timer.js';
import SceneRunner from './SceneRunner.js';
import TimedScene from './TimedScene.js';
import Level from './Level.js';
import Scene from './Scene.js';
import Player from './traits/Player.js';

import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';

import {createPlayerProgressLayer} from './layers/playerProgress.js';
import {createColorLayer} from './layers/color.js';
import {createTextLayer} from './layers/text.js';

import {createLevelLoader} from './loaders/level.js';
import {makePlayer, createPlayerEnvironment, findPlayers} from './player.js';

import {loadEntities} from './entities.js';
import {loadFont} from './loaders/font.js';

import {setupKeyboard} from './input.js';

async function main(canvas) {
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const mario = entityFactory.player();
  makePlayer(mario, 'MARIO');

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name) {
    const loadScreen = new Scene();
    loadScreen.compositor.layers.push(createColorLayer('#000'));
    loadScreen.compositor.layers.push(
      createTextLayer(font, `Loading ${name}...`),
    );
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === 'goto') {
        for (const entity of findPlayers(touches)) {
          runLevel(spec.name);
          return;
        }
      }
    });

    const playerEnvironment = createPlayerEnvironment(mario);
    mario.pos.set(0, 0);
    level.entities.add(mario);

    const dashboardLayer = createDashboardLayer(font, level);
    const collisionLayer = createCollisionLayer(level);

    const waitScreen = new TimedScene();
    waitScreen.countDown = 0.2;
    waitScreen.compositor.layers.push(createColorLayer('#000'));
    waitScreen.compositor.layers.push(dashboardLayer);
    waitScreen.compositor.layers.push(createPlayerProgressLayer(font, level));
    sceneRunner.addScene(waitScreen);

    level.compositor.layers.push(collisionLayer);
    level.compositor.layers.push(dashboardLayer);
    sceneRunner.addScene(level);

    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    entityFactory,
    videoContext,
    deltaTime: null,
  };

  const timer = new Timer();
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  };

  timer.start();
  window.runLevel = runLevel;
  runLevel('1-1');
}

const canvas = document.getElementById('game');
main(canvas);
