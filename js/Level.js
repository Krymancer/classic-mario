import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';

export default class Level {
  constructor() {
    this.compositor = new Compositor();
    this.entities = new Set();

    this.length = 0;
    this.gravity = 1500;
    this.totalTime = 0;

    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = null;
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

  setCollisionGrid(matrix) {
    this.tileCollider = new TileCollider(matrix);
  }
}
