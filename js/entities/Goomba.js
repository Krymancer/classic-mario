import Entity from '../Entity.js';
import Trait from '../Trait.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

import {loadSpriteSheet} from '../loader.js';

import {Sides} from '../Entity.js';

export function loadGoomba() {
  return loadSpriteSheet('goomba').then(createGoombaFactory);
}

function createGoombaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');

  function routeAnimation(goomba) {
    if (goomba.killable.dead) {
      return 'flat';
    }
    return walkAnimation(goomba.lifeTime);
  }

  function drawnGoomba(context) {
    sprite.draw(routeAnimation(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new Behavior());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new Killable());
    goomba.addTrait(new Solid());
    goomba.addTrait(new Physics());

    goomba.draw = drawnGoomba;

    return goomba;
  };
}

class Behavior extends Trait {
  constructor() {
    super('behavior');
  }

  collides(us, them) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        us.killable.kill(us);
        us.pendulumMove.speed = 0;
      } else {
        them.killable.kill(them);
      }
    }
  }
}
