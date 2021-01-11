import Entity from '../Entity.js';
import Trait from '../Trait.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import Stomper from '../traits/Stomper.js';

import {loadSpriteSheet} from '../loaders/sprite.js';

export function loadGoomba() {
  return loadSpriteSheet('goomba').then(createGoombaFactory);
}

function createGoombaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');

  function routeAnimation(goomba) {
    if (goomba.traits.get(Killable).dead) {
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
    super();
  }

  collides(us, them) {
    if (us.traits.get(Killable).dead) {
      return;
    }

    if (them.traits.has(Stomper)) {
      if (them.vel.y > us.vel.y) {
        us.traits.get(Killable).kill(us);
        us.traits.get(PendulumMove).speed = 0;
      } else {
        them.traits.get(Killable).kill(them);
      }
    }
  }
}
