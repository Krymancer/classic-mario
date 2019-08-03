import SpriteSheet from "./SpriteSheet.js"
import Compositor from "./Compositor.js"
import Entity from "./Entity.js"
import Timer from "./Timer.js"
import KeyboardState from "./KeyboardState.js"
import {createCollisionLayer} from "./layers.js"

import {loadImage,loadLevel} from "./loader.js"
import {createPlayer} from "./entities.js"

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const gravity = 2000;

Promise.all([
    createPlayer(),
    loadLevel("1-1")
]).then(([player,level]) => {

    level.compositor.layers.push(createCollisionLayer(level));

    player.pos.set(64,180);
    level.entities.add(player);

    

    const SPACE = 32;
    const RIGHT = 39;
    const LEFT = 37;
    const UP = 38;


    const input = new KeyboardState();
    input.addMapping(SPACE, keyState => {
        if(keyState){
            player.jump.start();
        }else{
            player.jump.cancel();
        }
    });
    input.addMapping(UP, keyState => {
        if(keyState){
            player.jump.start();
        }else{
            player.jump.cancel();
        }
    });

    input.addMapping(RIGHT, keyState => {
        player.go.direction = keyState;
    });
    input.addMapping(LEFT, keyState => {
        player.go.direction = -keyState;
    });

    input.listen(window);

    ['mousedown', 'mousemove'].forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            if (event.buttons === 1) {
                player.vel.set(0, 0);
                player.pos.set(event.offsetX, event.offsetY);
            }
        });
    });


    

    const timer = new Timer();
    timer.update = function update(deltaTime){
        level.update(deltaTime);
        level.compositor.draw(context);
        player.vel.y += gravity * deltaTime;
    }

    timer.start();

});




