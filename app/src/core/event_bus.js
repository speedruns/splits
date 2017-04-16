class EventBus {
  constructor(callbacks) {
    this.callbacks = callbacks || {};
  }
  on(event_name, func) {
    this.callbacks[event_name] = this.callbacks[event_name] || [];
    this.callbacks[event_name].push(func);
  };

  fire(event_name, evt_data) {
    let callbacks = this.callbacks[event_name] || [];
    for(const cb of callbacks) {
      cb(evt_data);
    }
  };
};
