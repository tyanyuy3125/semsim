var current = new Date();
var newMoonEpoch = new Date("2018-01-17");
newMoonEpoch.setUTCHours(2);
newMoonEpoch.setUTCMinutes(17);
var timespeed = 1;

const TIME = {
  // These function return a number between 0 and 1
  // indicating the proportion of the time in the year.
  ProportionInYear: function () {
    var start = new Date(current.getFullYear(), 0, 1);
    return (current.getTime() - start.getTime()) / 31556926000;
  },

  // IMPORTANT: this function use UTC time
  ProportionInDay: function () {
    return (
      current.getUTCHours() / 24 +
      current.getUTCMinutes() / 24 / 60 +
      current.getUTCSeconds() / 24 / 3600
    );
  },

  ProportionInLunarMonth: function () {
    var c = current.getTime();
    var o = newMoonEpoch.getTime();
    var t = 29.530588853 * 24 * 3600 * 1000;
    return (c - o - Math.floor((c - o) / t) * t) / t;
  },

  update: function (delta) {
    current.setTime(current.getTime() + delta * timespeed);
  },

  get timespeed() {
    return timespeed;
  },

  set timespeed(newTimespeed) {
    timespeed = newTimespeed;
  },

  get current() {
    return current;
  },
};

export default TIME;
