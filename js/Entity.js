import {Vector2d} from "./Math.js"

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom')    
}

export default class Entity{
    constructor(){
        this.pos = new Vector2d(0,0);
        this.vel = new Vector2d(0,0);
        this.size = new Vector2d(0,0);

        this.traits = [];
    }

    addTrait(trait){
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    update(deltaTime){
        this.traits.forEach(trait => {
            trait.update(this, deltaTime)
        });
    }

    obstruct(side){
        this.traits.forEach(trait => {
            trait.obstruct(this, side);
        });
    }
}
