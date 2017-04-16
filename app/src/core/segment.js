class Segment {
  constructor(run, name, initial_time) {
    this.run          = run;
    this.name         = name || 'Segment';
    this.elapsed_time = initial_time || 0;
  };

  add_time(millis) {
    this.elapsed_time += millis;
  };

  reset() {
    this.elapsed_time = 0;
  };
}
