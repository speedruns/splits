class Segment {
  constructor(run) {
    this.run            = run;
    this.pb_time        = null;
    this.best_time      = null;
    this.original_best  = null;
    this.name           = 'Segment';
    this.elapsed_time   = null;
    this.started_at     = null;
    this.ended_at       = null;
  };

  add_time(millis) {
    this.elapsed_time += millis;
  };

  reset() {
    this.best_time = this.original_best;
    this.elapsed_time = null;
    this.started_at = 0;
  };

  enter(starting_time) {
    this.started_at = starting_time;
    this.elapsed_time = 0;
  };

  reenter(additional_time) {
    this.best_time = this.original_best;
    this.add_time(additional_time);
  };

  leave(ending_time) {
    this.ended_at = ending_time;
    if(!this.best_time || this.elapsed_time < this.best_time) {
      this.best_time = this.elapsed_time;
    }
  };


  time_in_run() {
    return this.started_at + this.elapsed_time;
  };


  as_json() {
    return {
      name: this.name,
      pb:   this.pb_time,
      best: this.best_time
    };
  };

  static from_json(json, run) {
    let seg = new Segment(run);
    seg.name          = json.name;
    seg.pb_time       = json.pb;
    seg.best_time     = json.best;
    seg.original_best = json.best;
    return seg;
  };
};

module.exports = Segment;
