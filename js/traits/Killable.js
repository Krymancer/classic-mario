import Trait from '../Trait.js';

import {Sides} from '../Entity.js';

export default class Killable extends Trait {
  constructor() {
    super('killable');
    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 2;
    this.remove = true;
  }

  kill() {
    this.qeue(() => (this.dead = true));
  }

  revive() {
    this.dead = false;
  }

  update(entity, {deltaTime}, level) {
    if (this.dead) {
      if (this.remove) {
        this.deadTime += deltaTime;
        if (this.deadTime > this.removeAfter) {
          this.qeue(() => level.entities.delete(entity));
        }
      }
    }
  }
}
