import {Vector2d} from '../Math.js';
import Trait from '../Trait.js';

export default class PipeTraveller extends Trait {
  constructor() {
    super();
    this.direction = new Vector2d(0, 0);
    this.movement = new Vector2d(0, 0);
    this.distance = new Vector2d(0, 0);
  }
}
