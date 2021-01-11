import {Vector2d} from './Math.js';

export default class Camera {
  constructor() {
    this.pos = new Vector2d(0, 0);
    this.size = new Vector2d(256, 224);

    this.min = new Vector2d(0, 0);
    this.max = new Vector2d(Infinity, Infinity);
  }
}
