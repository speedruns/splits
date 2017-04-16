class Splits {
  constructor(timer, segments) {
    this.timer    = timer || new Timer();
    this.segments = segments || [];

    this.timer.on_update = this.update.bind(this);

    this.active_segment = 0;
    this.running = false;
  };


  add_segment() {
    this.segments.push(new Segment(this.timer));
  };

  increment_segment() {
    if(this.active_segment < this.segments.length - 1) {
      this.segments[this.active_segment].stop();
      this.active_segment += 1;
      this.segments[this.active_segment].start();
    } else {
      this.stop();
    }
  };


  update() {
    this.segments[this.active_segment].update();
  };

  start() {
    // Start with the first split
    this.timer.start();
    this.segments[this.active_segment].start();
    this.running = true;
  };

  stop() {
    this.timer.stop();
    this.segments[this.active_segment].stop();
    this.running = false;
  };
};
