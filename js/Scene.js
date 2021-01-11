import Compositor from './Compositor.js';
import EventEmitter from './EventEmitter.js';

export default class Scene {
  static EVENT_COMPLETE = Symbol('scene complete');
  constructor() {
    this.compositor = new Compositor();
    this.events = new EventEmitter();
  }

  update(gameContext) {}

  draw(gameContext) {
    const {videoContext} = gameContext;
    this.compositor.draw(videoContext);
  }

  pause() {}
}
