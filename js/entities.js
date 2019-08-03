import Entity from "./Entity.js"
import Trait from "./Trait.js"
import Velocity from "./traits/Velocity.js"
import Jump from "./traits/Jump.js"
import Go from "./traits/Go.js"
import {loadChar} from "./sprites.js"

export function createPlayer(){
    return loadChar().then(sprite => {
        const player = new Entity();
        player.size.set(14,16);

        player.addTrait(new Go());    
        player.addTrait(new Jump());    
        //player.addTrait(new Velocity());

         
        player.draw = function playerDraw(context){
            sprite.draw('idle',context,this.pos.x,this.pos.y);
        }

        return player;
    });
}