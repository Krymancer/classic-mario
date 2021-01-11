import Camera from './Camera.js';
import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';
import MusicController from './MusicController.js';
import EventEmitter from './EventEmitter.js';
import Scene from './Scene.js';
import {findPlayers} from './player.js';

function focusPlayer(level) {
  for (const player of findPlayers(level.entities)) {
    level.camera.pos.x = Math.max(0, player.pos.x - 100);
  }
}

export default class Level extends Scene {
  static EVENT_TRIGGER = Symbol('trigger');
  constructor() {
    super();

    this.name = '';

    this.entities = new Set();

    this.camera = new Camera();

    this.length = 0;
    this.gravity = 1500;
    this.totalTime = 0;

    this.music = new MusicController();

    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = new TileCollider();
  }

  update(gameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    focusPlayer(this);

    this.totalTime += gameContext.deltaTime;
  }

  draw(gameContext) {
    const {videoContext} = gameContext;
    this.compositor.draw(videoContext, this.camera);
  }

  pause() {
    this.music.pause();
  }
}
