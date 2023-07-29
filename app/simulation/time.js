// Time module
// Maintain global animation run times for celestial systems.

var current = new Date();
var newMoonEpoch = new Date("2018-01-17");
newMoonEpoch.setUTCHours(2);
newMoonEpoch.setUTCMinutes(17);
var timespeed = 1;

const TIME = {
  // The first three functions return a number between 0 and 1

  // indicating the proportion of the time in the year.
  ProportionInYear: function () {
    var start = new Date(current.getFullYear(), 0, 1);
    return (current.getTime() - start.getTime()) / 31556926000;
  },

  // indicating the proportion of the time in the day.
  ProportionInDay: function () {
    // IMPORTANT: this function use UTC time
    return (
      current.getUTCHours() / 24 +
      current.getUTCMinutes() / 24 / 60 +
      current.getUTCSeconds() / 24 / 3600
    );
  },

  // indicating the proportion of the time in the lunar month.
  ProportionInLunarMonth: function () {
    var c = current.getTime();
    var o = newMoonEpoch.getTime();
    var t = 29.530588853 * 24 * 3600 * 1000;
    return (c - o - Math.floor((c - o) / t) * t) / t;
  },

  // indicating the proportion of the time in the sun cycle.
  ProportionInSunCycle: function () {
    var c = current.getTime();
    var o = newMoonEpoch.getTime();
    var t = c - o;
    return (t / 2203850000);
  },


  // `TIME.update()` should only be called in tick function
  update: function (delta) {
    current.setTime(current.getTime() + delta * timespeed);
  },



  // These functions at the bottom can be called by the interactive part 
  // to control and display the time

  // sync current time with real time
  sync: function() {
    current = new Date();
    timespeed = 1;
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

  set current(newCurrent) {
    current = newCurrent;
  }
};

export default TIME;
