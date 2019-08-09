import BondingBox  from "./BoundingBox.js"

import {Vector2d} from "./Math.js"
import BoundingBox from "./BoundingBox.js";

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right')
}

export default class Entity{
    constructor(){
        this.pos = new Vector2d(0,0);
        this.vel = new Vector2d(0,0);
        this.size = new Vector2d(0,0);
        this.offset = new Vector2d(0,0);
        this.bounds = new BoundingBox(this.pos,this.size,this.offset);
        this.lifeTime = 0;
        this.canCollide = true;


        this.traits = [];
    }

    addTrait(trait){
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    update(deltaTime, level){
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level)
        });
        this.lifeTime += deltaTime;
    }

    obstruct(side, match){
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }

    collides(candidate){
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        });
    }

    draw(){

    }

    finalize(){
        this.traits.forEach(trait => trait.finalize());
    }
}
