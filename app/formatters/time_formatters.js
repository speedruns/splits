rivets.formatters.time = function(millis) {
  let cs  = ~~(millis / 10) % 100,
      s   = ~~(millis / 1000) % 60,
      m   = ~~(millis / (1000*60)) % 60,
      h   = ~~(millis / (1000*60*60));

  if(h > 0) {
    return sprintf("%d:%02d:%02d.%02d", h, m, s, cs);
  } else if(m > 0) {
    return sprintf("%d:%02d.%02d", m, s, cs);
  } else {
    return sprintf("%d.%02d", s, cs);
  }
};
