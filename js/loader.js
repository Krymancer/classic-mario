import Level from "./Level.js"
import SpriteSheet from "./SpriteSheet.js"

import {createBackgroundLayer,createSpriteLayer} from "./layers.js"
import {createAnimation} from "./animation.js"

export function loadImage(path){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener('load',() => {
            resolve(img);
        });
        img.src = path;
    });
}

function loadJSON(path){
    return fetch(path).then( res => res.json());
}

export function loadSpriteSheet(name){
    return loadJSON(`/classic-mario/sprites/${name}.json`)
    .then(sheetSpec => Promise.all([
        sheetSpec,
        loadImage(sheetSpec.imagePath)
    ]))
    .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image,sheetSpec.tileW,sheetSpec.tileH);

            if(sheetSpec.tiles){
                sheetSpec.tiles.forEach(tileSpec => {
                    sprites.createTile(
                        tileSpec.name,
                        tileSpec.index[0],
                        tileSpec.index[1]);
                });
            }

            if(sheetSpec.frames){
                sheetSpec.frames.forEach(frameSpec => {
                    sprites.create(frameSpec.name, ...frameSpec.rect);
                });
            }

            if(sheetSpec.animations){
                sheetSpec.animations.forEach(animSpec => {
                    const animation = createAnimation(
                        animSpec.frames,
                        animSpec.frameLength);
                    sprites.createAnimation(animSpec.name, animation);
                });
            }

            return sprites;
    });
}

export function loadLevel(name){
    return loadJSON(`levels/${name}.json`)
    .then(levelSpec => Promise.all([
        levelSpec,
        loadSpriteSheet(levelSpec.spriteSheet)
    ]))
    .then(([levelSpec,backgorundSprites]) => { 
        const level = new Level();
        createTiles(level,levelSpec.bg);

        const backgroundLayer = createBackgroundLayer(level,backgorundSprites);
        level.compositor.layers.push(backgroundLayer);

        const spriteLayer = createSpriteLayer(level.entities);
        level.compositor.layers.push(spriteLayer);

        return level;
    });
}

function createTiles(level,backgrounds){
    function applyRange(background, xStart,xLength,yStart,yLength) {
        const xEnd = xStart + xLength;
        const yEnd = yStart + yLength;
        for(let x = xStart; x < xEnd; x++){
            for(let y = yStart; y < yEnd; y++){
                level.tiles.set(x,y,{
                    name: background.tile,
                    type: background.type
                })
            }
        }
    }

    backgrounds.forEach(background => {
        background.range.forEach( (range) => {
            if(range.length === 4){
                const [xStart,xLength,yStart,yLength] = range;
                applyRange(background,xStart,xLength,yStart,yLength);
            }else if(range.length === 3){
                const [xStart,xLength,yStart] = range;
                const yLength = 1;
                applyRange(background,xStart,xLength,yStart,yLength);
            }else if(range.length === 2){
                const [xStart,yStart] = range;
                const xLength = 1;
                const yLength = 1;
                applyRange(background,xStart,xLength,yStart,yLength);
            }
        });
    });
}