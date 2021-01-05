import EventEmmiter from './EventEmitter.js';

export default class Trait {
  constructor(name) {
    this.NAME = name;

    this.events = new EventEmmiter();
    this.tasks = [];
  }

  finalize() {
    this.tasks.forEach((task) => task());
    this.tasks.length = 0;
  }

  update() {}

  obstruct() {}

  collides(us, them) {}

  queue(task) {
    this.tasks.push(task);
  }
}
