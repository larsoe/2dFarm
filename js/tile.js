const TILES = {
    WATER: 1,
    ROCK: 2,
    GRASS: 3,
    DIRT: 4,
    PLOWED: 5,
    FARM: 6
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

const COLORS = { TILES: {}, PLANTS: {} },
      NAMES = { TILES: {}, PLANTS: {}, STAGES: {}};

COLORS.PLANTS[PLANTS.WHEAT] = [200, 200, 50];
COLORS.PLANTS[PLANTS.MELON] = [164, 207, 56];
COLORS.PLANTS[PLANTS.RHYE] = [150, 156, 95];
COLORS.PLANTS[PLANTS.CORN] = [156, 117, 78];
COLORS.TILES[TILES.ROCK] = [50, 50, 50];
COLORS.TILES[TILES.WATER] = [0, 0, 200];
COLORS.TILES[TILES.GRASS] = [161, 212, 144];
COLORS.TILES[TILES.DIRT] = [130, 62, 17];
COLORS.TILES[TILES.PLOWED] = [212, 161, 144];
COLORS.TILES[TILES.FARM] = [50, 200, 250];

NAMES.PLANTS[PLANTS.WHEAT] = "wheat";
NAMES.PLANTS[PLANTS.MELON] = "melon";
NAMES.PLANTS[PLANTS.RHYE] = "rhye";
NAMES.PLANTS[PLANTS.CORN] = "corn";
NAMES.TILES[TILES.WATER] = 'water';
NAMES.TILES[TILES.ROCK] = 'rock';
NAMES.TILES[TILES.GRASS] = 'grass';
NAMES.TILES[TILES.DIRT] = 'dirt';
NAMES.TILES[TILES.PLOWED] = 'plowed';
NAMES.TILES[TILES.FARM] = 'farm';
NAMES.STAGES[STAGES.SOWN] = 'sown';
NAMES.STAGES[STAGES.YOUNG] = 'young';
NAMES.STAGES[STAGES.ADULT] = 'adult';
NAMES.STAGES[STAGES.MATURE] = 'mature';
NAMES.STAGES[STAGES.OLD] = 'old';
NAMES.STAGES[STAGES.ROTTEN] = 'rotten';

function Tile(pos)
{
	this.pos = pos; // Vector
  this.type = TILES.DIRT;
  const r = random(100);
  if ( r < 5) {
    this.type = TILES.ROCK;
  } else if ( r < 15) {
    this.type = TILES.WATER;
  }
  if (this.type == TILES.FARM) {
    this.seed = Math.round(random(1, 4));
    this.growth_rate = 0.03;
  } else {
    this.growth_rate = 0;
  }
  this.age = 0.0;
  this.stage = 1;
}

Tile.prototype.tick = function() {
    this.age += this.growth_rate;
    if (this.age > 15) {
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
  this.type = TILES.DIRT;
}

Tile.prototype.describe = function() {
  let out = NAMES.TILES[this.type];
  if (this.type == TILES.FARM) {
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
  this.type = TILES.PLOWED;
}

Tile.prototype.plant = function(seed) {
  if (this.type != TILES.PLOWED) {
    return false;
  }
  this.type = TILES.FARM;
  this.seed = seed;
  this.stage = 1;
  this.growth_rate = 0.03; // DEFAULT FOR SEED TYPE

  return true;
}

Tile.prototype.render = function() {
  push();
  if (this.type == TILES.FARM) {
    const c = COLORS.PLANTS[this.seed];
    fill(color(c[0], c[1], c[2]));
  } else {
    const c = COLORS.TILES[this.type];
    fill(color(c[0], c[1], c[2]));
  }
  noStroke();

  let w = CONF.WIDTH / CONF.WORLD.WIDTH,
    h = CONF.HEIGHT / CONF.WORLD.HEIGHT,
    x = this.pos.x * w,
    y = this.pos.y * h;

  rect(x, y, w, h);

  fill(5);
  textSize(10);
  textAlign(CENTER);

  let tekst = NAMES.TILES[this.type];
  if (this.type == TILES.ROCK || this.type == TILES.WATER){
    fill(240);
  }
  if (this.type == TILES.FARM) {
    tekst = tekst + "\n" + NAMES.STAGES[this.stage] +
    "\n" + NAMES.PLANTS[this.seed];

  }
  text(tekst, x + (w/2), y + 10);

  pop();
}
