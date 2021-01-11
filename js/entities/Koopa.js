import Entity from '../Entity.js';
import Trait from '../Trait.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

import {loadSpriteSheet} from '../loaders/sprite.js';
import Stomper from '../traits/Stomper.js';

const STATE_WALKING = Symbol('walking');
const STATE_HIDDING = Symbol('hidding');
const STATE_PANIC = Symbol('panic');

export function loadKoopa() {
  return loadSpriteSheet('koopa').then(createKoopaFactory);
}

export function loadKoopaGreen() {
  return loadSpriteSheet('koopa-green').then(createKoopaFactory);
}

export function loadKoopaBlue() {
  return loadSpriteSheet('koopa-blue').then(createKoopaFactory);
}

function createKoopaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');
  const wakeAnimation = sprite.animations.get('wake');

  function createRouterAnimation(koopa) {
    if (
      koopa.traits.get(Behavior).state === STATE_HIDDING ||
      koopa.traits.get(Behavior).state === STATE_PANIC
    ) {
      if (koopa.traits.get(Behavior).hideTime > 3) {
        return wakeAnimation(koopa.traits.get(Behavior).hideTime);
      }
      return 'hiding';
    }

    if (koopa.traits.get(Behavior).state === STATE_PANIC) {
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
    super();
    this.state = STATE_WALKING;
    this.hideTime = 0;
    this.hideDuration = 5;
    this.panicSpeed = 200;
    this.walkeSpeed = null;
  }

  collides(us, them) {
    if (us.traits.get(Killable).dead) {
      return;
    }

    if (them.traits.has(Stomper)) {
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
      us.traits.get(Killable).kill();
      us.trais.get(Solid).obstructs = false;
      us.vel.set(100, -200);
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.traits.get(Killable).kill();
    } else if (this.state === STATE_HIDDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDirection = Math.sign(us.vel.x);
      const impactDirection = Math.sign(us.pos.x - them.pos.x);

      if (travelDirection !== 0 && travelDirection !== impactDirection) {
        them.traits.get(Killable).kill();
      }
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.traits.get(PendulumMove).enable = false;
    if (this.walkeSpeed === null) {
      this.walkeSpeed = us.traits.get(PendulumMove).speed;
    }

    this.hideTime = 0;
    this.state = STATE_HIDDING;
  }

  unhide(us) {
    us.traits.get(PendulumMove).enable = true;
    us.traits.get(PendulumMove).speed = this.walkeSpeed;
    this.state = STATE_WALKING;
  }

  panic(us, them) {
    us.traits.get(PendulumMove).enable = true;
    us.traits.get(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = STATE_PANIC;
  }

  update(us, {deltaTime}) {
    if (this.state === STATE_HIDDING) {
      this.hideTime += deltaTime;
      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }
}
