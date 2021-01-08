import {Vector2d} from './Math.js';
import BoundingBox from './BoundingBox.js';
import AudioBoard from './AudioBoard.js';
import EventBuffer from './EventBuffer.js';
import Trait from './Trait.js';

export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left'),
  RIGHT: Symbol('right'),
};

export default class Entity {
  constructor() {
    this.audio = new AudioBoard();
    this.sounds = new Set();

    this.events = new EventBuffer();

    this.pos = new Vector2d(0, 0);
    this.vel = new Vector2d(0, 0);
    this.size = new Vector2d(0, 0);
    this.offset = new Vector2d(0, 0);
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
    this.lifeTime = 0;

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.NAME] = trait;
  }

  update(gameContext, level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);
    });

    this.playSounds(this.audio, gameContext.audioContext);

    this.lifeTime += gameContext.deltaTime;
  }

  obstruct(side, match) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match);
    });
  }

  collides(candidate) {
    this.traits.forEach((trait) => {
      trait.collides(this, candidate);
    });
  }

  draw() {}

  finalize() {
    this.events.emit(Trait.EVENT_TASK, this);
    this.traits.forEach((trait) => trait.finalize(this));
    this.events.clear();
  }

  playSounds(AudioBoard, audioContext) {
    this.sounds.forEach((name) => {
      AudioBoard.playAudio(name, audioContext);
    });
    this.sounds.clear();
  }
}
