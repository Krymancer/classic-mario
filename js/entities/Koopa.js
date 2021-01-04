import Entity from '../Entity.js';
import Trait from '../Trait.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

import {loadSpriteSheet} from '../loader.js';

import {Sides} from '../Entity.js';

const STATE_WALKING = Symbol('walking');
const STATE_HIDDING = Symbol('hidding');
const STATE_PANIC = Symbol('panic');

export function loadKoopa() {
  return loadSpriteSheet('koopa').then(createKoopaFactory);
}

function createKoopaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');
  const wakeAnimation = sprite.animations.get('wake');

  function createRouterAnimation(koopa) {
    if (
      koopa.behavior.state === STATE_HIDDING ||
      koopa.behavior.state === STATE_PANIC
    ) {
      if (koopa.behavior.hideTime > 3) {
        return wakeAnimation(koopa.behavior.hideTime);
      }
      return 'hiding';
    }

    if (koopa.behavior.state === STATE_PANIC) {
      return 'hiding';
    }

    return walkAnimation(koopa.lifeTime);
  }

  function drawnKoopa(context) {
    sprite.draw(createRouterAnimation(this), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Behavior());
    koopa.addTrait(new Killable());
    koopa.addTrait(new Solid());
    koopa.addTrait(new Physics());

    koopa.draw = drawnKoopa;

    return koopa;
  };
}

class Behavior extends Trait {
  constructor() {
    super('behavior');
    this.state = STATE_WALKING;
    this.hideTime = 0;
    this.hideDuration = 5;
    this.panicSpeed = 200;
    this.walkeSpeed = null;
  }

  collides(us, them) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomper(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleStomper(us, them) {
    if (this.state === STATE_WALKING) {
      this.hide(us);
    } else if (this.state === STATE_HIDDING) {
      us.killable.kill();
      us.solid.obstructs = false;
      us.vel.set(100, -200);
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.killable.kill();
    } else if (this.state === STATE_HIDDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDirection = Math.sign(us.vel.x);
      const impactDirection = Math.sign(us.pos.x - them.pos.x);

      if (travelDirection !== 0 && travelDirection !== impactDirection) {
        them.killable.kill();
      }
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.pendulumMove.enable = false;
    if (this.walkeSpeed === null) {
      this.walkeSpeed = us.pendulumMove.speed;
    }

    this.hideTime = 0;
    this.state = STATE_HIDDING;
  }

  unhide(us) {
    us.pendulumMove.enable = true;
    us.pendulumMove.speed = this.walkeSpeed;
    this.state = STATE_WALKING;
  }

  panic(us, them) {
    us.pendulumMove.enable = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = STATE_PANIC;
  }

  update(us, deltaTime) {
    if (this.state === STATE_HIDDING) {
      this.hideTime += deltaTime;
    }

    if (this.hideTime > this.hideDuration) {
      this.unhide(us);
    }
  }
}
