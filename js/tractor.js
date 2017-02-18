function Tractor() {
  this.pos = createVector(1, 1); // starts out in the upper left corner
  this.target = createVector(3, 3);
  const w = CONF.WIDTH / CONF.WORLD.WIDTH;
  this.cord = createVector(this.pos.x * w, this.pos.y * w);
}

Tractor.prototype.tick = function() {
  const w = CONF.WIDTH / CONF.WORLD.WIDTH;
  if (this.pos == this.target) {
    this.cord = createVector(this.pos.x * w, this.pos.y * w);

    // If we are at a chosen position, we can do some work
    let tile = tiles[this.pos.x][this.pos.y];
    if (tile.type == TILE_TYPES.DIRT) {
      tile.plow();
    }

  } else {
    // If tractor is not currently at it's desired spot, move a little
    let target_cord = createVector(this.target.x * w, this.target.y * w);
    let desired = target_cord.sub(this.cord);
    if (desired.mag() < CONF.TRACTOR.SPEED * deltaTime) {
      this.pos = this.target;
      this.cord = createVector(this.pos.x * w, this.pos.y * w);
    } else {
      desired.setMag(CONF.TRACTOR.SPEED * deltaTime);
      this.cord.add(desired);
    }
  }

};

Tractor.prototype.render = function() {
  push();
  stroke(237, 50, 75);
  fill(145, 31, 63);
  translate(this.cord.x, this.cord.y);
  // image(images.tractor);
  const w = CONF.WIDTH / CONF.WORLD.WIDTH / 3;
  rect(w, w, w, w);
  pop();
};
