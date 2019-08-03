import {loadImage} from "./loader.js"
import SpriteSheet from "./SpriteSheet.js"


export function loadBackground(){
    return loadImage("assets/tileset.png").then(img => {
        const sprites = new SpriteSheet(img,16,16);
        sprites.createTile("ground",0,0);
        sprites.createTile("sky",3,23);
        return sprites;
    });
}

export function loadChar(){
    return loadImage("assets/characters.gif").then(img => {
        const sprites = new SpriteSheet(img,16,16);
        sprites.create("idle",276,44,16,16);
        return sprites;
    });
}