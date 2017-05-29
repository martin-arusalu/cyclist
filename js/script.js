class player {
  constructor() {
    this.points = 0;
    this.money = 2000;
    this.cycle = null;
    this.races = null;
  }

  get totalDistance() {
    
  }

  get totalAverage() {

  }

  get totalMaxSpeed() {

  }
}

class freeride {
  constructor() {
    this.totalDistance = 
      this.maxDistance = 
      this.distance = 
      this.totalAverage = 
      this.maxAverage = 
      this.average = 
      this.speed = 0
  }
}

class race {
  constructor() {
    
  }
}

var game = function () {
  var stage, lever, speed = {}, dir = 'up', dst = {}, time = Date.now(), startTime;

  // Start  
  init();

  function init() {
    // Set Stage
    stage = new createjs.Stage('myCanvas');
    createjs.Touch.enable(stage);
    loaded();
  }

  function loaded() {
    // Current speed
    speed.cur = speed.max = speed.avg = dst.val = startTime = 0;

    // Current speed display
    speed.curDisplay = new createjs.Text(speed.cur + "km/h", "30px Helvetica", "#fff");
    speed.curDisplay.y = stage.canvas.height / 6;

    // Max speed display
    speed.maxDisplay = new createjs.Text("Max: " + speed.max + "km/h", "14px Helvetica", "#fff");
    speed.maxDisplay.y = stage.canvas.height / 6 + 40;

    // Average speed display
    speed.avgDisplay = new createjs.Text("Average: " + speed.avg + "km/h", "12px Helvetica", "#fff");
    speed.avgDisplay.y = stage.canvas.height / 6 + 60;

    // Distance display
    dst.display = new createjs.Text("Distance: " + Math.floor(dst.val/10) / 100 + " km", "12px Helvetica", "#fff");
    dst.display.y = stage.canvas.height / 6 + 80;

    // Common text attributes    
    speed.curDisplay.x = speed.maxDisplay.x = speed.avgDisplay.x = dst.display.x = stage.canvas.width / 2;
    speed.curDisplay.textBaseline = speed.maxDisplay.textBaseline = speed.avgDisplay.textBaseline = dst.display.textBaseline = "middle";
    speed.curDisplay.textAlign = speed.maxDisplay.textAlign = speed.avgDisplay.textAlign = dst.display.textAlign = "center";

    // Moveable lever / crank    
    lever = new createjs.Shape();
    lever.graphics.beginFill('#ddd');
    lever.graphics.drawRect(0, 0, 2, 100);
    lever.regX = 0;
    lever.regY = 0;
    lever.x = stage.canvas.width / 2;
    lever.y = stage.canvas.height / 2;

    // Add elements to stage
    stage.addChild(lever, dst.display, speed.avgDisplay, speed.maxDisplay, speed.curDisplay);

    window.setInterval(() => { 
      // dst.val = distance in meters
      // Date.now() - startTime = elapsed milliseconds
      // 3600 = constant to make the speed km/h
      // * 100 / 100 = to get 2 decimal places
      speed.avg = Math.floor(dst.val / (Date.now() - startTime) * 3600 * 100) / 100;
    }, 1000);

    createjs.Ticker.addEventListener('tick', onTick);
    createjs.Ticker.setFPS(60);
  }

  function onTick(e) {
    if (!e.paused) {

      // Distance
      var elapsed = Date.now() - time;
      time = Date.now();
      dst.val += (speed.cur / 3600) * elapsed; // m/ms * ms - distance in meters
      dst.display.text = "Distance: " + Math.floor(dst.val / 10) / 100 + " km";
      if (dst.val > 0 && startTime == 0) startTime = Date.now();

      // Calculate angle from lever to mouse
      // Ref: https://stackoverflow.com/a/38982141
      var angleInRadians = Math.atan2(stage.mouseY - lever.y, stage.mouseX - lever.x);  
      var angleInDegrees = angleInRadians * (180 / Math.PI);
      // End of Ref

      if (dir == 'up' && (angleInDegrees > -120 && angleInDegrees < -60)) {
        speed.cur += 3;
        dir = 'down';
      } else if (dir == 'down' && (angleInDegrees > 60 && angleInDegrees < 120)) {
        speed.cur += 3;
        dir = 'up';
      }

      // Align lever with mouse
      lever.rotation = angleInDegrees + 270;

      // Wind, friction and other counter forces.
      if (speed.cur > 0.1) speed.cur -= 0.01 * speed.cur;
      else speed.cur = 0;

      // Update speed text      
      speed.curDisplay.text = Math.floor(speed.cur) + "km/h";

      // Update max speed
      if (speed.cur > speed.max) speed.max = speed.cur;
      speed.maxDisplay.text = "Max: " + Math.floor(speed.max) + "km/h";

      // Update average
      speed.avgDisplay.text = "Average: " + speed.avg + "km/h";

      stage.update(e);
    }
  }
}

// On load
window.addEventListener('load', game);