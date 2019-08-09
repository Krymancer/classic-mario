import Entity from "../Entity.js"
import Go from "../traits/Go.js"
import Jump from "../traits/Jump.js"
import Stomper from "../traits/Stomper.js"
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";

import {loadSpriteSheet} from "../loader.js"

const SLOW_DRAG = 1/1000;
const FAST_DRAG = 1/5000;

export function loadPlayer(){
    return loadSpriteSheet('player').then(createPlayerFactory);
}

function createPlayerFactory(sprite){
    const runAnimation = sprite.animations.get('run');

    function routeFrame(player){
        if(player.killable.dead){
            return 'dead';
        }

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

    function setTurboState(turboOn){
        this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    }

    function playerDraw(context){
        sprite.draw(routeFrame(this),context,0,0, this.go.heading < 0);
    }

    return function createPlayer(){
        const player = new Entity();
        player.size.set(14,16);

        player.addTrait(new Go());
        player.addTrait(new Jump());    
        player.addTrait(new Stomper());
        player.addTrait(new Killable());
        player.addTrait(new Solid());
        player.addTrait(new Physics());

        player.killable.removeAfter = 0;
        player.turbo = setTurboState;
        player.draw = playerDraw;

        player.turbo(false);

        return player;
    }
}