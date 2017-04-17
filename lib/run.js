const Timer   = require('./timer');
const Segment = require('./segment');

class Run {
  constructor(segments) {
    this.segments = [];
    this.timer    = new Timer();
    this.initialize();
    this.timer.subscribe('timer.tick', this.update.bind(this));
  };

  initialize() {
    this.segment_idx = 0;
    this.state = Run.STATES.not_started;
    for(let segment of this.segments) {
      segment.reset();
    }
  };

  add_segment(name) {
    this.segments.push(new Segment(this, name));
  };

  current_segment() {
    return this.segments[this.segment_idx];
  };


  split() {
    if(this.timer.state == Run.STATES.not_started) return;
    if(this.segment_idx < this.segments.length - 1) {
      this.current_segment().leave(this.timer.elapsed_time);
      this.segment_idx += 1;
      this.current_segment().enter(this.timer.elapsed_time);
    } else {
      this.finish();
    }
  };

  unsplit() {
    if(this.timer.state == Run.STATES.not_started) return;
    if(this.state == Run.STATES.finished) {
      this.resume();
    } else if(this.segment_idx > 0) {
      let curr_seg = this.current_segment();
      this.segment_idx -= 1;
      let prev_seg = this.current_segment();
      prev_seg.add_time(curr_seg.elapsed_time);
      curr_seg.reset();
    }
  };


  update(timer_data) {
    if(this.state == Run.STATES.in_progess) {
      this.current_segment().add_time(timer_data.delta);
    }
  };


  start() {
    this.state = Run.STATES.in_progess;
    this.timer.start();
    this.current_segment().enter(0);
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
};

Run.STATES = Object.freeze({
  not_started: 'not started',
  in_progess: 'in progess',
  finished: 'finished'
});

module.exports = Run;
