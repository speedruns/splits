const EventBus = require('./event_bus');

class Timer {
  constructor(offset) {
    this.offset = offset || 0;
    this.initialize();
    this.events = new EventBus();
  };

  initialize() {
    this.elapsed_time   = this.offset;
    this.started_at     = null;
    this.updated_at     = null;

    this.state          = Timer.STATES.not_started;

    this.tick_rate      = 25;
    this._interval      = null;
  };


  update() {
    if(this.state == Timer.STATES.running) {
      let now = Date.now();
      let delta = now - this.updated_at;
      this.elapsed_time += delta;
      this.updated_at = now;

      this.events.fire('timer.tick', {
        elapsed_time: this.elapsed_time,
        delta:        delta,
        now:          now
      });
    }
  };


  start() {
    this.started_at = Date.now();
    this.updated_at = this.started_at;
    this.state = Timer.STATES.running;
    this.set_interval();
    this.events.fire('timer.start', { started_at: this.started_at });
  };

  stop() {
    if(this.state != Timer.STATES.running) return;
    this.state = Timer.STATES.stopped;
    this.clear_interval();
    this.events.fire('timer.stop');
  };

  pause() {
    if(this.state != Timer.STATES.running) return;
    this.state = Timer.STATES.paused;
    this.clear_interval();
    this.events.fire('timer.pause');
  };

  resume() {
    if(this.state == Timer.STATES.paused) this.updated_at = Date.now();
    this.state = Timer.STATES.running;
    this.set_interval();
    this.events.fire('timer.resume');
  };

  reset() {
    this.clear_interval();
    this.initialize();
    this.events.fire('timer.reset');
  };


  set_interval() {
    if(this._interval != null) return;
    this._interval = setInterval(this.update.bind(this), this.tick_rate);
  };

  clear_interval() {
    if(this._interval) clearInterval(this._interval);
    this._interval = null;
  };


  subscribe(event, callback) {
    this.events.on(event, callback);
  };
};

Timer.STATES = Object.freeze({
  not_started: 'not started',
  running: 'running',
  paused: 'paused',
  stopped: 'stopped'
});

module.exports = Timer;
