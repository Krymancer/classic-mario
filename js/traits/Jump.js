import Trait from "../Trait.js"

export default class Jump extends Trait { 
    constructor(){
        super('jump');

        this.duraction = 0.5;
        this.velocity = 200;
        this.engageTime = 0;
    }

    start(){
        this.engageTime = this.duraction;
    }

    cancel(){
        this.engageTime = 0;
    }

    update(entity,deltaTime){
        if(this.engageTime >  0){
            entity.vel.y = -this.velocity;
            this.engageTime -= deltaTime;
        }
    }
}
