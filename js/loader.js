import Level from "./Level.js"
import {createBackgroundLayer,createSpriteLayer} from "./layers.js"
import {loadBackground} from "./sprites.js"

export function loadImage(path){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener('load',() => {
            resolve(img);
        });
        img.src = path;
    });
}

export function loadLevel(name){
    return Promise.all([
        fetch(`levels/${name}.json`)
        .then( res => res.json()),
        loadBackground()
    ])
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
    backgrounds.forEach(background => {
        background.range.forEach( ([x1,x2,y1,y2]) => {
            for(let x = x1; x < x2; x++){
                for(let y = y1; y < y2; y++){
                    level.tiles.set(x,y,{
                        name: background.tile
                    })
                }
            }
        });
    });
}