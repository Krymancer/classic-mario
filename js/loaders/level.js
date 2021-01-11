import Level from '../Level.js';

import {createSpriteLayer} from '../layers/sprite.js';
import {createBackgroundLayer} from '../layers/background.js';
import {loadJSON} from '../loader.js';
import {loadMusicSheet} from '../loaders/music.js';
import {loadSpriteSheet} from '../loaders/sprite.js';
import {Matrix, Vector2d} from '../Math.js';
import Entity from '../Entity.js';
import LevelTimer from '../traits/LevelTimer.js';
import Trigger from '../traits/Trigger.js';

function createTimer() {
  const timer = new Entity();
  timer.addTrait(new LevelTimer());
  return timer;
}

function loadPattern(name) {
  return loadJSON(`sprites/patterns/${name}.json`);
}

function setupBehavior(level) {
  const timer = createTimer();
  level.entities.add(timer);

  level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
    level.music.playTheme();
  });
  level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
    level.music.playHurryTheme();
  });
}

function setupBackground(levelSpec, level, backgorundSprites, patterns) {
  levelSpec.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, patterns);
    const backgroungLayer = createBackgroundLayer(
      level,
      grid,
      backgorundSprites,
    );
    level.compositor.layers.push(backgroungLayer);
    level.tileCollider.addGrid(grid);
  });
}

function setupCamera(level) {
  let maxX = 0;
  let maxTileSize = 0;
  for (const resolver of level.tileCollider.resolvers) {
    if (resolver.tileSize > maxTileSize) {
      maxTileSize = resolver.tileSize;
    }
    resolver.matrix.forEach((tile, x, y) => {
      if (x > maxX) {
        maxX = x;
      }
    });
  }
  level.camera.max.x = (maxX + 1) * maxTileSize;
}

function setupCheckpoints(levelSpec, level) {
  if (!levelSpec.checkpoints) {
    level.checkpoints.push(new Vector2d(0, 0));
    return;
  }

  levelSpec.checkpoints.forEach(([x, y]) => {
    level.checkpoints.push(new Vector2d(x, y));
  });
}

function setupEntities(levelSpec, level, entityFactory) {
  const spriteLayer = createSpriteLayer(level.entities);
  level.compositor.layers.push(spriteLayer);
  levelSpec.entities.forEach(({name, pos: [x, y]}) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.pos.set(x, y);
    level.entities.add(entity);
  });
}

function setupTriggers(levelSpec, level) {
  if (!levelSpec.triggers) {
    return;
  }

  for (const triggerSpec of levelSpec.triggers) {
    const trigger = new Trigger();

    trigger.conditions.push((entity, touches, gc, level) => {
      level.events.emit(Level.EVENT_TRIGGER, triggerSpec, entity, touches);
    });

    const entity = new Entity();
    entity.addTrait(trigger);
    entity.pos.set(triggerSpec.pos[0], triggerSpec.pos[1]);
    entity.size.set(64, 64);
    level.entities.add(entity);
  }
}

export function createLevelLoader(entityFactory) {
  return function loadLevel(name) {
    return loadJSON(`levels/${name}.json`)
      .then((levelSpec) =>
        Promise.all([
          levelSpec,
          loadSpriteSheet(levelSpec.spriteSheet),
          loadMusicSheet(levelSpec.musicSheet),
          loadPattern(levelSpec.patternSheet),
        ]),
      )
      .then(([levelSpec, backgroundSprites, musicPlayer, patterns]) => {
        const level = new Level();
        level.name = name;
        level.music.setPlayer(musicPlayer);

        setupBackground(levelSpec, level, backgroundSprites, patterns);
        setupEntities(levelSpec, level, entityFactory);
        setupTriggers(levelSpec, level);
        setupCheckpoints(levelSpec, level);

        setupBehavior(level);
        setupCamera(level);

        for (const resolver of level.tileCollider.resolvers) {
          const backgroundLayer = createBackgroundLayer(
            level,
            resolver.matrix,
            backgroundSprites,
          );
          level.compositor.layers.push(backgroundLayer);
        }

        const spriteLayer = createSpriteLayer(level.entities);

        level.compositor.layers.push(spriteLayer);

        return level;
      });
  };
}

function* expandSpan(xStart, xLength, yStart, yLength) {
  const xEnd = xStart + xLength;
  const yEnd = yStart + yLength;
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      yield {
        x,
        y,
      };
    }
  }
}

function expandRange(range) {
  if (range.length === 4) {
    const [xStart, xLength, yStart, yLength] = range;
    return expandSpan(xStart, xLength, yStart, yLength);
  } else if (range.length === 3) {
    const [xStart, xLength, yStart] = range;
    const yLength = 1;
    return expandSpan(xStart, xLength, yStart, yLength);
  } else if (range.length === 2) {
    const [xStart, yStart] = range;
    const xLength = 1;
    const yLength = 1;
    return expandSpan(xStart, xLength, yStart, yLength);
  }
}

function* expandRanges(ranges) {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

function* expandTiles(tiles, patterns) {
  function* walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const {x, y} of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;
        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          yield* walkTiles(tiles, derivedX, derivedY);
        } else {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        }
      }
    }
  }

  const xoff = 0;
  const yoff = 0;
  yield* walkTiles(tiles, xoff, yoff);
}

function createGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const {tile, x, y} of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
  }

  return grid;
}
