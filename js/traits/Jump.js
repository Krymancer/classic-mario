import Trait from '../Trait.js';

import {Sides} from '../Entity.js';

export default class Jump extends Trait {
  constructor() {
    super();

    this.ready = 0;
    this.duraction = 0.3;
    this.velocity = 200;
    this.engageTime = 0;
    this.requestTime = 0;
    this.gracePeriod = 0.1;
    this.speedBost = 0.3;
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  update(entity, {deltaTime, audioContext}) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        entity.sounds.add('jump');
        this.engageTime = this.duraction;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBost);
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }

  obstruct(entity, side) {
    if (side === Sides.BOTTOM) {
      this.ready = 1;
    } else if (side === Sides.TOP) {
      this.cancel();
    }
  }
}
