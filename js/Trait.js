export default class Trait {
  static EVENT_TASK = Symbol('task');

  constructor() {
    this.listeners = [];
  }

  finalize(entity) {
    this.listeners = this.listeners.filter((listener) => {
      entity.events.process(listener.name, listener.callback);
      return --listener.count;
    });
  }

  listen(name, callback, count = Infinity) {
    const listener = {name, callback, count};
    this.listeners.push(listener);
  }

  update() {}

  obstruct() {}

  collides(us, them) {}

  queue(task) {
    this.listen(Trait.EVENT_TASK, task, 1);
  }
}
