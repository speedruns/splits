class Segment {
  constructor(run, name) {
    this.run            = run;
    this.pb_time        = null;
    this.best_time      = null;
    this.old_best_time  = null;
    this.name           = name || 'Segment';
    this.elapsed_time   = 0;
    this.started_at     = null;
    this.ended_at       = null;
  };

  add_time(millis) {
    this.elapsed_time += millis;
  };

  reset() {
    this.best_time = this.old_best_time;
    this.elapsed_time = 0;
    this.started_at = 0;
  };

  enter(starting_time) {
    this.started_at = starting_time;
  };

  leave(ending_time) {
    this.ended_at = ending_time;
    if(!this.best_time || this.elapsed_time < this.best_time) {
      this.old_best_time = this.best_time;
      this.best_time = this.elapsed_time;
    }
  };

  time_in_run() {
    return this.started_at + this.elapsed_time;
  };
};
