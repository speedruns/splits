const Timer   = require('./timer');
const Segment = require('./segment');

class Run {
  constructor() {
    this.segments = [];
    this.timer    = new Timer();
    this.initialize();
    this.timer.subscribe('timer.tick', this.update.bind(this));
  };

  initialize() {
    this.segment_idx = 0;
    this.set_current_segment();
    this.state = Run.STATES.not_started;
    for(let segment of this.segments) {
      segment.reset();
    }
  };

  increment_segment() {
    if(this.segment_idx >= this.segments.length - 1) return;
    this.segment_idx += 1;
    this.set_current_segment();
  };

  decrement_segment() {
    if(this.segment_idx <= 0) return;
    this.segment_idx -= 1;
    this.set_current_segment();
  };

  set_current_segment() {
    this.current_segment = this.segments[this.segment_idx];
  }

  split() {
    if(this.timer.state == Run.STATES.not_started) return;
    if(this.segment_idx < this.segments.length - 1) {
      this.current_segment.leave(this.timer.elapsed_time);
      this.increment_segment();
      this.current_segment.enter(this.timer.elapsed_time);
    } else {
      this.finish();
    }
  };

  unsplit() {
    if(this.timer.state == Run.STATES.not_started) return;
    if(this.state == Run.STATES.finished) {
      this.resume();
    } else if(this.segment_idx > 0) {
      let added_time = this.current_segment.elapsed_time;
      this.current_segment.reset();
      this.decrement_segment();
      this.current_segment.reenter(added_time);
    }
  };


  update(timer_data) {
    if(this.state == Run.STATES.in_progess) {
      this.current_segment.add_time(timer_data.delta);
    }
  };


  start() {
    this.state = Run.STATES.in_progess;
    this.set_current_segment();
    this.current_segment.enter(0);
    this.timer.start();
  };

  stop() {
    this.timer.stop();
  };

  pause() {
    this.timer.pause();
  };

  resume() {
    this.state = Run.STATES.in_progess;
    this.timer.resume();
  };

  reset() {
    this.timer.reset();
    this.initialize();
  };

  finish() {
    this.stop();
    this.state = Run.STATES.finished;
  };


  start_or_resume() {
    if(this.timer.state == Timer.STATES.not_started) {
      this.start();
    } else if(this.state != Run.STATES.finished) {
      this.resume();
    }
  };


  as_json() {
    return {
      segments: this.segments.map(function(seg) { return seg.as_json() })
    };
  };

  static from_json(json) {
    let run = new Run();
    run.game = json.game;
    run.category = json.category;
    for(let seg_json of json.segments) {
      let new_segment = Segment.from_json(seg_json, run);
      run.segments.push(new_segment);
    }
    return run;
  };
};

Run.STATES = Object.freeze({
  not_started: 'not started',
  in_progess: 'in progess',
  finished: 'finished'
});

module.exports = Run;
