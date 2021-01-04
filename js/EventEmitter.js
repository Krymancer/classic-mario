export default class EventEmitter {
  constructor() {
    this.listeners = [];
  }

  listen(name, callback) {
    const listener = {name, callback};
    this.listeners.push(listener);
  }

  emmit(name, ...args) {
    this.listeners.forEach((listener) => {
      if (listener.name === name) {
        listener.callback(...args);
      }
    });
  }
}
