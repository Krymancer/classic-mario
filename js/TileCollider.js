import TileResolver from './TileResolver.js';

import {ground} from './tiles/ground.js';
import {brick} from './tiles/brick.js';

const X = 0;
const Y = 1;

const handlers = {
  ground,
  brick,
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

  checkX(entity) {
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
        this.handle(X, entity, match);
      });
    }
  }

  checkY(entity) {
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
        this.handle(Y, entity, match, resolver);
      });
    }
  }

  handle(index, entity, match, resolver) {
    if (!match) return;
    const handler = handlers[match.tile.type];
    if (handler) {
      handler[index](entity, match, resolver);
    }
  }
}
