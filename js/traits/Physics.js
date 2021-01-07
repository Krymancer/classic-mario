import Trait from '../Trait.js';

import {Sides} from '../Entity.js';

export default class Physics extends Trait {
  constructor() {
    super('physics');
    this.enabled = true;
  }

  update(entity, gameContext, level) {
    const {deltaTime} = gameContext;
    if (!this.enabled) {
      return;
    }
    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider.checkY(entity, gameContext, level);

    entity.vel.y += level.gravity * deltaTime;
  }
}
