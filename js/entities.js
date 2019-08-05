import Entity from "./Entity.js"
import Jump from "./traits/Jump.js"
import Go from "./traits/Go.js"

import {loadSpriteSheet} from "./loader.js"
import {createAnimation} from "./animation.js"

const SLOW_DRAG = 1/1000;
const FAST_DRAG = 1/5000;

export function createPlayer(){
    return loadSpriteSheet('player').then(sprite => {
        const player = new Entity();
        player.size.set(14,16);

        player.addTrait(new Go());   
        player.go.dragFactor = SLOW_DRAG;
         
        player.addTrait(new Jump());    

        player.turbo = function setTurboState(turboOn){
            this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
        }

        const runAnimation = createAnimation(['run-1','run-2','run-3'], 6);

        function routeFrame(player){
            if(player.jump.falling){
                return 'jump';
            }

            if(player.go.distance > 0){
                if(
                    (player.vel.x > 0 && player.go.direction < 0) 
                    || (player.vel.x < 0 && player.go.direction > 0)){
                        return 'break';
                }
                return runAnimation(player.go.distance);
            }
            return 'idle';
        }
         
        player.draw = function playerDraw(context){
            sprite.draw(routeFrame(this),context,0,0, player.go.heading < 0);
        }

        return player;
    });
}