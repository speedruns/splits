const Timer   = require('./timer');
const Segment = require('./segment');
const Attempt = require('./attempt');

class Run {
  constructor() {
    this.segments = [];
    this.attempts = [];
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
      this.current_segment.leave(this.timer.elapsed_time);
      this.finish();
    }
  };

  unsplit() {
    if(this.timer.state == Run.STATES.not_started) return;
    if(this.state == Run.STATES.finished) {
      this.resume();
      let added_time = this.timer.elapsed_time - this.current_segment.ended_at;
      this.current_segment.reenter(added_time);
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
    if(this.state == Run.STATES.in_progess) this.save_attempt();
    this.timer.reset();
    this.initialize();
  };

  finish() {
    if(this.state == Run.STATES.finished) return;
    this.stop();
    this.state = Run.STATES.finished;
    this.save_attempt();
  };


  start_or_resume() {
    if(this.timer.state == Timer.STATES.not_started) {
      this.start();
    } else if(this.state != Run.STATES.finished) {
      this.resume();
    }
  };


  get pb_attempt() {
    return this.attempts[this.pb_attempt_id];
  };

  save_attempt() {
    let attempt = Attempt.from_json({
      completed: this.state == Run.STATES.finished,
      time: this.timer.elapsed_time,
      started_at: null,
      finished_at: null,
      segments: this.segments.map(function(seg) { return seg.ended_at })
    });
    this.attempts.push(attempt);
    if(attempt.completed && attempt.time < this.pb_attempt.time) {
      this.pb_attempt_id = this.attempts.length - 1;
    }

    console.log(this.attempts);
  };


  as_json() {
    return {
      game:       this.game,
      category:   this.category,
      segments:   this.segments.map(function(seg) { return seg.as_json() }),
      pb_attempt: this.pb_attempt_id,
      attempts:   this.attempts.map(function(att) { return att.as_json() })
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
    run.pb_attempt_id = json.pb_attempt;
    for(let att_json of json.attempts) {
      let new_attempt = Attempt.from_json(att_json);
      run.attempts.push(new_attempt);
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
