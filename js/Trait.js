import EventEmmiter from './EventEmitter.js';

export default class Trait {
  constructor(name) {
    this.NAME = name;

    this.events = new EventEmmiter();
    this.sounds = new Set();
    this.tasks = [];
  }

  finalize() {
    this.tasks.forEach((task) => task());
    this.tasks.length = 0;
  }

  update() {}

  obstruct() {}

  playSounds(AudioBoard, audioContext) {
    this.sounds.forEach((name) => {
      AudioBoard.playAudio(name, audioContext);
    });
    this.sounds.clear();
  }

  collides(us, them) {}

  qeue(task) {
    this.tasks.push(task);
  }
}
