import TileResolver from './TileResolver.js';

import {ground} from './tiles/ground.js';
import {brick} from './tiles/brick.js';
import {coin} from './tiles/coin.js';

const X = 0;
const Y = 1;

const handlers = {
  ground,
  brick,
  coin,
};

export default class TileCollider {
  constructor() {
    this.resolvers = [];
  }

  addGrid(tileMatrix) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  test(entity) {
    this.checkY(entity);
  }

  checkX(entity, gameContext, level) {
    let x;

    if (entity.vel.x > 0) {
      x = entity.bounds.right;
    } else if (entity.vel.x < 0) {
      x = entity.bounds.left;
    } else {
      return;
    }
    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        x,
        x,
        entity.bounds.top,
        entity.bounds.bootom,
      );

      matches.forEach((match) => {
        this.handle(X, entity, match, resolver, gameContext, level);
      });
    }
  }

  checkY(entity, gameContext, level) {
    let y;

    if (entity.vel.y > 0) {
      y = entity.bounds.bottom;
    } else if (entity.vel.y < 0) {
      y = entity.bounds.top;
    } else {
      return;
    }
    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left,
        entity.bounds.right,
        y,
        y,
      );

      matches.forEach((match) => {
        this.handle(Y, entity, match, resolver, gameContext, level);
      });
    }
  }

  handle(index, entity, match, resolver, gameContext, level) {
    if (!match) return;
    const tileCollisionContext = {
      entity,
      match,
      resolver,
      gameContext,
      level,
    };
    const handler = handlers[match.tile.type];
    if (handler) {
      handler[index](tileCollisionContext);
    }
  }
}
