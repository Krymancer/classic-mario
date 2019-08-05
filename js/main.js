import Timer from "./Timer.js"
import Camera from "./Camera.js"

import {setupKeyboard} from "./input.js"
import {loadLevel} from "./loader.js"
import {createPlayer} from "./entities.js"

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

Promise.all([
    createPlayer(),
    loadLevel("1-1")
]).then(([player,level]) => {

    const camera = new Camera();
    window.camera = camera;
        
    player.pos.set(64,64);
    level.entities.add(player);

    const input = setupKeyboard(player);
    input.listen(window);

    const timer = new Timer();
    timer.update = function update(deltaTime){
        level.update(deltaTime);

        if(player.pos.x > 100){
            camera.pos.x = player.pos.x - 100;
        }

        level.compositor.draw(context,camera);
    }

    timer.start();
});