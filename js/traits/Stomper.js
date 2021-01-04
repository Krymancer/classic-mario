import Trait from '../Trait.js';

import {Sides} from '../Entity.js';

export default class Stomper extends Trait {
  constructor() {
    super('stomper');
    this.bounceSpeed = 400;
    this.didStomp = false;

    this.onStomp = function () {};
  }

  obstruct(entity, side) {}

  bounce(us, them) {
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -this.bounceSpeed;
  }

  collides(us, them) {
    if (!them.killable || them.killable.dead) {
      return;
    }

    if (us.vel.y > them.vel.y) {
      this.bounce(us, them);
      this.sounds.add('stomp');
      this.onStomp(us, them);
    }
  }
}
