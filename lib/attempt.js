module.exports = class Attempt {
  constructor() {
    this.completed  = false;
    this.time       = 0;
    this.started_at = null;
    this.ended_at   = null;
    this.segments   = [];
  };

  as_json() {
    return {
      completed:  this.completed,
      time:       this.time,
      started_at: this.started_at,
      ended_at:   this.ended_at,
      segments:   this.segments
    };
  };

  static from_json(json) {
    let attempt = new Attempt();
    attempt.completed   = json.completed;
    attempt.time        = json.time;
    attempt.started_at  = json.started_at;
    attempt.ended_at    = json.ended_at;
    attempt.segments    = json.segments;
    return attempt;
  };
};
