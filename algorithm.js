var timeSpent = 0;
var playedDuration = 0;
var totalDuration = 0;
var completionPercentage = 0;
var pairs = [];
var currentPair = {};

function play(currentTime) {
  currentPair.st = currentTime;
}

function pause(currentTime) {
  currentPair.en = currentTime;
  insert(currentPair);
  currentPair = {};
}

function end(currentTime) {
  currentPair.en = currentTime;
  insert(currentPair);

  calculate();
}

function seek(beforeTime, afterTime) {
  pause(beforeTime);
  play(afterTime);
}

function insert(newPair) {
  let ii = 0;
  while (ii < pairs.length && newPair.en >= pairs[ii].st) {
    pair = pairs[ii];
    if ((newPair.st >= pair.st && newPair.st <= pair.en) || (pair.st >= newPair.st && pair.st <= newPair.en)) {
      // modify the newPair to cover existing pair that's covering or slicing with the newPair
      newPair.st = Math.min(pair.st, newPair.st); 
      newPair.en = Math.max(pair.en, newPair.en);
      pairs.splice(ii, 1); // remove existing pair that's covering or slicing with the newPair
    } else {
      ii++;
    }
  };

  pairs.splice(ii, 0, newPair); // insert the new pair into its proper position (sorted)
  timeSpent += newPair.en - newPair.st; // add to total timestamp
}

function calculate() {
  playedDuration = 0;
  pairs.forEach(function(pair) {
    playedDuration += pair.en - pair.st;
  });
  completionPercentage = playedDuration / totalDuration * 100;
}

function getMMSS(seconds) {
  let date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(14, 5);
}
