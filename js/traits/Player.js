import Trait from '../Trait.js';

export default class Player extends Trait {
  constructor() {
    super('player');
    this.lives = 3;
    this.score = 0;
  }
}
