import Trait from "../Trait.js"

export default class Go extends Trait { 
    constructor(){
        super('go');

        this.direction = 0;
        this.accleration = 400; 
        this.deceletarion = 300;
        this.dragFactor = 1/5000;

        this.distance = 0;
        this.heading = 1;
    }

    update(entity,deltaTime){
        const absX = Math.abs(entity.vel.x);
        if(this.direction !== 0){
            entity.vel.x += this.accleration * deltaTime * this.direction;

            if(entity.jump){
                if(entity.jump.falling === false){
                    this.heading = this.direction;
                }
            }else{
                this.heading = this.direction;
            }

        }else if(entity.vel.x !== 0){
            const decel = Math.min(absX, this.deceletarion * deltaTime);
            entity.vel.x += entity.vel.x > 0 ? -decel : decel; 
        }else{
            this.distance = 0;
        }

        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;

        this.distance += absX * deltaTime;
    }
}
