EventBus;

class Run {
  constructor(segments) {
    this.segments = [];
    this.timer    = new Timer();
    this.initialize();
    this.timer.subscribe('timer.tick', this.update.bind(this));
  };

  initialize() {
    this.active_segment = 0;
    this.state = Run.STATES.not_started;
    for(let segment of this.segments) {
      segment.reset();
    }
  };

  add_segment(name) {
    this.segments.push(new Segment(this, name));
  };


  split() {
    if(this.active_segment < this.segments.length - 1) {
      this.active_segment += 1;
    } else {
      this.finish();
    }
  };


  update(timer_data) {
    if(this.state == Run.STATES.in_progess) {
      this.segments[this.active_segment].add_time(timer_data.delta);
    }
  };


  start() {
    this.state = Run.STATES.in_progess;
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
  }

  reset() {
    this.timer.reset();
    this.initialize();
  }

  finish() {
    this.stop();
    this.state = Run.STATES.finished;
  }


  start_or_resume() {
    if(this.timer.state == Timer.STATES.not_started) {
      this.start();
    } else if(this.state != Run.STATES.finished) {
      this.resume();
    }
  };
};

Run.STATES = {
  not_started: 'not started',
  in_progess: 'in progess',
  finished: 'finished'
}
