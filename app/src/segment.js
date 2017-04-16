class Segment {
  constructor(timer, initial_time) {
    this.timer            = timer;
    this.elapsed_time     = initial_time || 0;
    this.last_update_time = 0;
    this.active           = false;
  };


  update() {
    if(this.active) {
      this.elapsed_time += this.timer.elapsed_time - this.last_update_time;
      this.last_update_time = this.timer.elapsed_time;
    }
  };


  start() {
    this.last_update_time = this.timer.elapsed_time;
    this.active = true;
  };


  stop() {
    this.active = false;
  };
}
