function Tractor() {
  this.pos = createVector(1, 1); // starts out in the upper left corner
  this.target = createVector(1, 1);
  const w = CONF.WIDTH / CONF.WORLD.WIDTH,
        h = CONF.HEIGHT / CONF.WORLD.HEIGHT;
  this.cord = createVector(this.pos.x * w, this.pos.y * h);
  this.queue = [];
}

Tractor.prototype.enqueue = function(target) {
  if (target == this.pos) return;
  if (this.target == this.pos) {
    this.target = target;
  } else {
    this.queue.push(target);
  }
};

Tractor.prototype.tick = function() {
  const w = CONF.WIDTH / CONF.WORLD.WIDTH,
        h = CONF.HEIGHT / CONF.WORLD.HEIGHT;
  if (this.pos == this.target) {
    this.cord = createVector(this.pos.x * w, this.pos.y * h);

    // If we are at a chosen position, we can do some work
    let tile = tiles[this.pos.x][this.pos.y];
    if (tile.type == TILES.DIRT) {
      tile.plow();
    } else if (tile.type == TILES.FARM) {
      if (tile.stage == STAGES.MATURE) {
        tile.harvest();
      }
    } else if (tile.type == TILES.PLOWED) {
      tile.plant(plantPick);
    }

    if (this.queue.length > 0) {
      this.target = this.queue.shift();
    }
  } else {
    // If tractor is not currently at it's desired spot, move a little
    let target_cord = createVector(this.target.x * w, this.target.y * h);
    let desired = target_cord.sub(this.cord);
    if (desired.mag() < CONF.TRACTOR.SPEED * deltaTime) {
      this.pos = this.target;
      this.cord = createVector(this.pos.x * w, this.pos.y * h);
    } else {
      desired.setMag(CONF.TRACTOR.SPEED * deltaTime);
      this.cord.add(desired);
    }
  }

};

Tractor.prototype.render = function() {
  push();
  stroke(237, 50, 75, 90);
  fill(145, 31, 63, 90);
  translate(this.cord.x, this.cord.y);
  // image(images.tractor);
  const w = CONF.WIDTH / CONF.WORLD.WIDTH / 3,
        h = CONF.HEIGHT / CONF.WORLD.HEIGHT / 3;
  rect(w, h+h/2, w, h);
  noStroke();
  fill(237, 50, 75);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("T", w*1.5, h*2);
  pop();
};
