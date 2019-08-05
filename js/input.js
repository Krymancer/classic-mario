import KeyboardState from "./KeyboardState.js"

export function setupKeyboard(player){

    const input = new KeyboardState();

    input.addMapping('Space', keyState => {
        if(keyState){
            player.jump.start();
        }else{
            player.jump.cancel();
        }
    });

    input.addMapping('ArrowUp', keyState => {
        if(keyState){
            player.jump.start();
        }else{
            player.jump.cancel();
        }
    });
    input.addMapping('KeyZ', keyState => {
        if(keyState){
            player.jump.start();
        }else{
            player.jump.cancel();
        }
    });

    input.addMapping('KeyX', keyState => {
        player.turbo(keyState);
    });
    input.addMapping('ArrowRight', keyState => {
        player.go.direction += keyState ? 1 : -1;
    });
    input.addMapping('ArrowLeft', keyState => {
        player.go.direction += keyState ? -1 : 1;
    });

    return input;
}