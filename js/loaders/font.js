import {loadImage} from "../loader.js"
import SpriteSheet from "../SpriteSheet.js"

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export async function loadFont(){
    return loadImage('./assets/font.png')
    .then(image =>{
        const fontSprite = new SpriteSheet(image);
        const size = 8;
        const rowLength = image.width;

        for(let [index, char] of [...CHARS].entries()){
            const x = index * size % rowLength;
            const y = Math.floor(index * size / rowLength) * size;
            fontSprite.create(char,x,y,size,size);
        }
        return new Font(fontSprite,size);
    });
}

class Font{
    constructor(sprites, size){
        this.sprites = sprites;
        this.size = size;
    }

    print(text,context,x,y){
        [...text].forEach((char,position) => {
            this.sprites.draw(char,context,x + position * this.size,y);
        });
    }
}