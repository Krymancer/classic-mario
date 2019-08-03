import Trait from "../Trait.js"

export default class Go extends Trait { 
    constructor(){
        super('go');

        this.direction = 0;
        this.speed = 4000; 
    }

    update(entity,deltaTime){
        entity.vel.x = this.speed * this.direction * deltaTime;
    }
}
