import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';
import MusicController from './MusicController.js';
import EventEmitter from './EventEmitter.js';

export default class Level {
  constructor() {
    this.compositor = new Compositor();
    this.entities = new Set();

    this.events = new EventEmitter();

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

    this.totalTime += gameContext.deltaTime;
  }
}
