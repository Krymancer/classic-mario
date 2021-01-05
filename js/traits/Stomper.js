import Trait from '../Trait.js';

export default class Stomper extends Trait {
  constructor() {
    super('stomper');
    this.bounceSpeed = 400;
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
      this.queue(() => this.bounce(us, them));
      us.sounds.add('stomp');
      this.events.emmit('stomp', us, them);
    }
  }
}
