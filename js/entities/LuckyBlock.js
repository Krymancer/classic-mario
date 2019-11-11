import Entity from "../Entity.js"
import Trait from "../Trait.js"
import Solid from "../traits/Solid.js";
import Killable from "../traits/Killable.js"
import Physics from "../traits/Physics.js";

import {
    loadSpriteSheet
} from "../loader.js"

export function loadLucky() {
    return loadSpriteSheet('lucky').then(createLuckyFactory);
}

function createLuckyFactory(sprite) {
    const blinkAnimation = sprite.animations.get('blink');

    function routeAnimation(lucky) {
        if (lucky.killable.dead) {
            return 'lucky-dead';
        }
        return blinkAnimation(lucky.lifeTime);
    }

    function drawnLucky(context) {
        sprite.draw(routeAnimation(this), context, 0, 0);
    }

    return function createLucky() {
        const lucky = new Entity();
        lucky.size.set(16, 16);


        lucky.addTrait(new Solid());
        lucky.addTrait(new Behavior());
        lucky.addTrait(new Killable());

        lucky.killable.remove = false;

        lucky.draw = drawnLucky;

        return lucky;
    }
}

class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (!us.killable.dead) {
            us.killable.kill(us);        
        }
    }
}