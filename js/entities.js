import {loadPlayer} from './entities/Player.js';
import {loadGoomba} from './entities/Goomba.js';
import {loadKoopa} from './entities/Koopa.js';

export function loadEntities(audioContext) {
  const entityFactories = {};

  function addAs(name) {
    return (factory) => (entityFactories[name] = factory);
  }

  return Promise.all([
    loadPlayer(audioContext).then(addAs('player')),
    loadGoomba(audioContext).then(addAs('goomba')),
    loadKoopa(audioContext).then(addAs('koopa')),
  ]).then(() => entityFactories);
}
