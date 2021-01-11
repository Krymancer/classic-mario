import Entity from '../Entity.js';
import Go from '../traits/Go.js';
import Jump from '../traits/Jump.js';
import Stomper from '../traits/Stomper.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

import {loadSpriteSheet} from '../loaders/sprite.js';
import {loadAudioBoard} from '../loaders/audio.js';

const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

export function loadPlayer(audioContext) {
  return Promise.all([
    loadSpriteSheet('player'),
    loadAudioBoard('player', audioContext),
  ]).then(([sprite, audio]) => {
    return createPlayerFactory(sprite, audio);
  });
}

function createPlayerFactory(sprite, audio) {
  const runAnimation = sprite.animations.get('run');

  function routeFrame(player) {
    if (player.traits.get(Killable).dead) {
      return 'dead';
    }

    if (player.traits.get(Jump).falling) {
      return 'jump';
    }

    if (player.traits.get(Go).distance > 0) {
      if (
        (player.vel.x > 0 && player.traits.get(Go).direction < 0) ||
        (player.vel.x < 0 && player.traits.get(Go).direction > 0)
      ) {
        return 'break';
      }
      return runAnimation(player.traits.get(Go).distance);
    }
    return 'idle';
  }

  function setTurboState(turboOn) {
    this.traits.get(Go).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  function playerDraw(context) {
    sprite.draw(
      routeFrame(this),
      context,
      0,
      0,
      this.traits.get(Go).heading < 0,
    );
  }

  return function createPlayer() {
    const player = new Entity();

    player.audio = audio;
    player.size.set(14, 16);

    player.addTrait(new Go());
    player.addTrait(new Jump());
    player.addTrait(new Stomper());
    player.addTrait(new Killable());
    player.addTrait(new Solid());
    player.addTrait(new Physics());

    player.traits.get(Killable).removeAfter = 0;
    player.turbo = setTurboState;
    player.draw = playerDraw;

    player.turbo(false);

    return player;
  };
}
