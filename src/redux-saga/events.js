export default class EventEmitter {
  events = {};
  emit(eventType, ...args) {
    const events = this.events[eventType];
    if (events && events.length) {
      events.forEach((event) => event(...args));
    }
  }
  once(eventType, fn) {
    const events = this.events[eventType] || (this.events[eventType] = []);
    const once = (...args) => {
      fn(...args);
      this.off(once);
    };
    events.push(once);
  }
  off(eventType, fn) {
    if (typeof fn !== "function") {
      this.events[eventType] = [];
    } else {
      const events = this.events[eventType];
      if (events && events.length) {
        this.events[eventType] = events.filter((event) => event !== fn);
      }
    }
  }
}
