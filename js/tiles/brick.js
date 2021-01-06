import {Sides} from '../Entity.js';

function handleX(entity, match) {
  if (entity.vel.x > 0) {
    if (entity.bounds.right > match.x1) {
      entity.obstruct(Sides.RIGHT, match);
    }
  } else if (entity.vel.x < 0) {
    if (entity.bounds.left < match.x2) {
      entity.obstruct(Sides.LEFT, match);
    }
  }
}

function handleY(entity, match, resolver) {
  if (entity.vel.y > 0) {
    if (entity.bounds.bottom > match.y1) {
      entity.obstruct(Sides.BOTTOM, match);
    }
  } else if (entity.vel.y < 0) {
    const grid = resolver.matrix;
    grid.delete(match.indexX, match.indexY);

    if (entity.bounds.top < match.y2) {
      entity.obstruct(Sides.TOP, match);
    }
  }
}

export const brick = [handleX, handleY];
