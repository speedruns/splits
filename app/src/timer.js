class Timer {
  constructor(offset) {
    this.offset           = offset || 0;
    this.start_time       = new Date();
    this.last_update_time = new Date();
    this.elapsed_time     = offset;
    this.running          = false;
    this.tick_rate        = 25;
    this._interval        = null;
  };

  update() {
    if(this.running) {
      this.last_update_time = new Date();
      // `elapsed_time` is calculated once. All other components that rely on
      // elapsed time should reference this value directly.
      this.elapsed_time = this.last_update_time - this.start_time + this.offset;
    } else {
      // If the timer is running, no update should occur
    }
  };

  elapsedTime() {
    return this.elapsed_time;
  };

  start() {
    this.start_time = new Date();
    this.running    = true;

    var self = this;
    this.interval = setInterval(function() {
      self.update();
    }, this.tick_rate);
  };

  stop() {
    this.running = false;

    clearInterval(this.interval);
    this.interval = null;
  };

  pause() {
    this.running = false;

    clearInterval(this.interval);
    this.interval = null;
  };

  reset() {
    this.running = false;
    this.start_time = new Date();
    this.elapsed_time = this.offset;

    clearInterval(this.interval);
    this.interval = null;
  };
};
