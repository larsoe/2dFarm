const TILE_TYPES = {
    GRASS: 1,
    DIRT: 2,
    PLOWED: 3,
    FARM: 4,
    WATER: 5,
    ROCK: 6
  },
  PLANTS = {
    WHEAT: 1,
    MELON: 2,
    RHYE: 3,
    CORN: 4
  },
  STAGES = {
    SOWN: 1,
    YOUNG: 2,
    ADULT: 3,
    MATURE: 4,
    OLD: 5,
    ROTTEN: 6
  }

const NAMES = {
  PLANTS: {
    1: "wheat",
    2: "melon",
    3: "rhye",
    4: "corn"
  },
  TILES: {
    1: 'grass',
    2: 'dirt',
    3: 'plowed',
    4: 'farm',
    5: 'water',
    6: 'rock'
  },
  STAGES: {
    1: 'sown',
    2: 'young',
    3: 'adult',
    4: 'mature',
    5: 'old',
    6: 'rotten'
  }
}


function Tile(pos)
{
	this.pos = pos; // Vector
  // this.type = TILE_TYPES.FARM;
  this.type = Math.round(random(1, 6));
  if (this.type == TILE_TYPES.FARM) {
    this.seed = Math.round(random(1, 4));
    this.growth_rate = 0.05;
  } else {
    this.growth_rate = 0;
  }
  this.age = 0.0;
  this.stage = 1;

}

Tile.prototype.tick = function() {
    this.age += this.growth_rate;
    if (this.age > 10) {
      this.stage += 1;
      this.age = 0.0
    }

    if (this.stage == STAGES.ROTTEN) {
      this.reset();
    }
}

Tile.prototype.reset = function() {
  this.seed = null;
  this.stage = 0;
  this.growth_rate = 0;
  this.type = TILE_TYPES.DIRT;
}

Tile.prototype.describe = function() {
  let out = NAMES.TILES[this.type];
  if (this.type == TILE_TYPES.FARM) {
    out += " : " + NAMES.STAGES[this.stage] + "\n" +
       NAMES.PLANTS[this.seed];
  }
  return out;
}

Tile.prototype.harvest = function() {
  barn[this.seed] +=1;
  this.reset();
}

Tile.prototype.plow = function() {
  // Check for dirt?
  this.type = TILE_TYPES.PLOWED;
}

Tile.prototype.plant = function(seed) {
  if (this.type != TILE_TYPES.PLOWED) {
    return false;
  }
  this.type = TILE_TYPES.FARM;
  this.seed = seed;
  this.stage = 1;
  this.growth_rate = 0.05; // DEFAULT FOR SEED TYPE

  return true;
}

Tile.prototype.render = function() {
  push();
  // stroke(200, 20);
  noStroke();


  const COLORS = {
    1: color(200, 200, 50),
    2: color(130, 62, 17),
    3: color(200, 50, 50),
    4: color(50, 200, 250),
    5: color(0, 0, 200),
    6: color(20, 20, 20)
  };

  fill(COLORS[this.type]);

  if (this.type == TILE_TYPES.FARM) {
    const COLORS = {
      1: color(200, 200, 50),
      2: color(164, 207, 56),
      3: color(200, 50, 50),
      4: color(156, 117, 78),
    }
    fill(COLORS[this.seed]);
  }

  // fill(this.color, this.color, this.color);
  let w = CONF.WIDTH / CONF.WORLD.WIDTH,
    h = CONF.HEIGHT / CONF.WORLD.HEIGHT,
    x = this.pos.x * w,
    y = this.pos.y * h;

  rect(x, y, w, h);

  fill(5);
  textSize(10);
  textAlign(CENTER);

  let tekst = NAMES.TILES[this.type];
  if (this.type == TILE_TYPES.ROCK || this.type == TILE_TYPES.WATER){
    fill(240);
  }
  if (this.type == TILE_TYPES.FARM) {
    tekst = tekst + "\n" + NAMES.STAGES[this.stage] +
    "\n" + NAMES.PLANTS[this.seed];

  }
  text(tekst, x + (w/2), y + 10);
  fill(5);

  pop();
}