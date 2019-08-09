import Level from "../Level.js"

import {
    createSpriteLayer
} from "../layers/sprite.js"
import {
    createBackgroundLayer
} from "../layers/background.js"
import {
    loadJSON,
    loadSpriteSheet
} from "../loader.js"
import {
    Matrix
} from "../Math.js"


function setupCollision(levelSpec, level) {
    const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
        return mergedTiles.concat(layerSpec.tiles);
    }, []);

    const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
    level.setCollisionGrid(collisionGrid);
}

function setupBackground(levelSpec, level, backgorundSprites) {
    levelSpec.layers.forEach(layer => {
        const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroungLayer = createBackgroundLayer(level, backgroundGrid, backgorundSprites);
        level.compositor.layers.push(backgroungLayer);
    });
}

function setupEntities(levelSpec, level, entityFactory) {
    const spriteLayer = createSpriteLayer(level.entities);
    level.compositor.layers.push(spriteLayer);
    levelSpec.entities.forEach(({name, pos: [x,y]}) => {
        const createEntity = entityFactory[name];
        const entity = createEntity();
        entity.pos.set(x,y);
        level.entities.add(entity);
    });
}

export function createLevelLoader(entityFactory) {
    return function loadLevel(name) {
        return loadJSON(`levels/${name}.json`)
            .then(levelSpec => Promise.all([
                levelSpec,
                loadSpriteSheet(levelSpec.spriteSheet)
            ]))
            .then(([levelSpec, backgorundSprites]) => {
                const level = new Level();

                setupCollision(levelSpec, level);
                setupBackground(levelSpec, level, backgorundSprites);
                setupEntities(levelSpec, level, entityFactory);
                level.length = levelSpec.length;
                
                return level;
            });
    }
}

function* expandSpan(xStart, xLength, yStart, yLength) {
    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;
    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            yield {
                x,
                y
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
            for (const {
                    x,
                    y
                } of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;
                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    yield* walkTiles(tiles, derivedX, derivedY);
                } else {
                    yield {
                        tile,
                        x: derivedX,
                        y: derivedY
                    };
                }
            }
        }
    }

    const xoff = 0;
    const yoff = 0;
    yield* walkTiles(tiles, xoff, yoff);
}

function createCollisionGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {
            tile,
            x,
            y
        } of expandTiles(tiles, patterns)) {
        grid.set(x, y, {
            type: tile.type
        });
    }

    return grid;
}

function createBackgroundGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {
            tile,
            x,
            y
        } of expandTiles(tiles, patterns)) {
        grid.set(x, y, {
            name: tile.name
        });
    }

    return grid;
}