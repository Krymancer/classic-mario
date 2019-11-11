import {loadPlayer} from "./entities/Player.js"
import {loadGoomba} from "./entities/Goomba.js"
import {loadKoopa} from "./entities/Koopa.js"
import {loadLucky} from "./entities/LuckyBlock.js"

export function loadEntities(){
    const entityFactories = {};

    function addAs(name){
        return factory => entityFactories[name] = factory;
    }

    return Promise.all([
        loadPlayer().then(addAs('player')),
        loadGoomba().then(addAs('goomba')),
        loadKoopa().then(addAs('koopa')),
        loadLucky().then(addAs('lucky'))
    ])
    .then(() => entityFactories);
}