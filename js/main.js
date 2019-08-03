import SpriteSheet from "./SpriteSheet.js"
import Compositor from "./Compositor.js"
import Entity from "./Entity.js"
import Timer from "./Timer.js"

import {setupKeyboard} from "./input.js"
import {createCollisionLayer} from "./layers.js"
import {loadImage,loadLevel} from "./loader.js"
import {createPlayer} from "./entities.js"

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

Promise.all([
    createPlayer(),
    loadLevel("1-1")
]).then(([player,level]) => {

    //level.compositor.layers.push(createCollisionLayer(level));

    player.pos.set(64,180);
    level.entities.add(player);

    const input = setupKeyboard(player);
    input.listen(window);

    const timer = new Timer();
    timer.update = function update(deltaTime){
        level.update(deltaTime);
        level.compositor.draw(context);
    }

    timer.start();
});