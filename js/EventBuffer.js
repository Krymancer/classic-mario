export default class EventBuffer {
  constructor() {
    this.events = [];
  }

  emmit(name, ...args) {
    const event = {name, args};
    this.events.push(event);
  }

  process(name, callback) {
    this.events.forEach((event) => {
      if (event.name === name) {
        callback(...event.args);
      }
    });
  }

  clear(name) {
    this.events.length = 0;
  }
}
