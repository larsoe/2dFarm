const CONF = {
        WIDTH: 600, HEIGHT: 600,
        WORLD: {
          WIDTH: 10, HEIGHT: 10,
        }
      }
;

let state = "PLAY", menu, menu2, tiles, inspector, plantPick = 1, barn={}
;

function setup() {
  createCanvas(CONF.WIDTH, CONF.HEIGHT);
  frameRate(60);
  lastFrame = millis();

  inspector = createDiv(" ").id("inspector");
  // menu = new Menu("Main Menu", createVector(50, 50), 400, 300);
  // menu.add(new Item('<div style="width: 100%; height: 150px; background: blue;margin-bottom: 1em;"> </div>'));
  // menu.add(new Button("Win", function() {console.log("WIN!");}));
  menu2 = new Panel("Side Menu", "actions");
  menu2.add(new Image("img/tractor.jpg", function() {console.log("Du vil ha Traktor?!");}));
  menu2.add(new Image("img/corn.png", function() {
    plantPick = PLANTS.CORN;
    console.log("Du vil ha corn?!");}));
  menu2.add(new Image("img/wheat.png", function() {
    plantPick = PLANTS.WHEAT;
    console.log("Du vil ha wheat?!");}));
  menu2.add(new Image("img/rhye.png", function() {
    plantPick = PLANTS.RHYE;
    console.log("Du vil ha rhye?!");}));
  menu2.add(new Image("img/melon.png", function() {
    plantPick = PLANTS.MELON;
    console.log("Du vil ha melon?!");}));
  menu2.add(new Image("img/barn.png", function() {
    console.log(barn);}));

  barn[PLANTS.CORN]=0;
  barn[PLANTS.WHEAT]=0;
  barn[PLANTS.RHYE]=0;
  barn[PLANTS.MELON]=0;

  tiles = [];
  for (var x = 0; x < CONF.WORLD.WIDTH; x++) {
    tiles[x] = [];
    for (var y = 0; y < CONF.WORLD.HEIGHT; y++) {
      tiles[x][y] = new Tile(createVector(x, y));
    }
  }
}

function draw() {
  deltaTime = (millis() - lastFrame) / 1000;
  lastFrame = millis();
  background(50);
  fill(0);
  noStroke();
  textFont("Arial");

  if (state == "PLAY") {
    Views.play();
    // menu.show();
    for (var x = 0; x < CONF.WORLD.WIDTH; x++) {
      for (var y = 0; y < CONF.WORLD.HEIGHT; y++) {
        tiles[x][y].tick();
      }
    }
  } else if (state == "READY") {
    Views.play();
  } else if (state == "START") {
    Views.start();
  } else if (state == "PAUSE") {
    Views.pause();
  } else if (state == "END") {
    Views.game_over();
  } else {
    console.error("UNKNOWN STATE: " + state);
  }
}

function mouseMoved() {
  if (mouseX > 0 && mouseX < CONF.WIDTH && mouseY > 0 && mouseY < CONF.HEIGHT) {
    let w = CONF.WIDTH / CONF.WORLD.WIDTH,
        h = CONF.HEIGHT / CONF.WORLD.HEIGHT,
        x = Math.floor(mouseX / w),
        y = Math.floor(mouseY / h),
        tile = tiles[x][y];
    inspector.html("["+x+","+y+"] TILE: " + tile.describe());
  }
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < CONF.WIDTH && mouseY > 0 && mouseY < CONF.HEIGHT) {
    let w = CONF.WIDTH / CONF.WORLD.WIDTH,
        h = CONF.HEIGHT / CONF.WORLD.HEIGHT,
        x = Math.floor(mouseX / w),
        y = Math.floor(mouseY / h),
        tile = tiles[x][y];
    if (tile.stage == STAGES.MATURE){
      console.log("WIN");
      tile.harvest();
      return;
    }

    if (tile.type == TILE_TYPES.PLOWED){
          tile.plant(plantPick);

    }
    if (tile.type == TILE_TYPES.DIRT){
        tile.plow();
    }

  }
}

function keyPressed() {
  if (state == "PLAY" || state == "READY") {
    if (keyCode === UP_ARROW) {
      menu.show();
      menu2.show();
    } else if (keyCode === DOWN_ARROW) {
    } else if (keyCode === LEFT_ARROW) {
    } else if (keyCode === RIGHT_ARROW) {
    }
  }

  if (key == ' ' && state == "START") {
    state = "PLAY";
  } else if (key == ' ' && state == "PLAY") {
  }
  if (keyCode === ESCAPE && state == "PLAY") {
    // if (music) song.pause();
    state = "PAUSE";
  } else if (keyCode === ESCAPE && state == "PAUSE") {
    // if (music) song.loop();
    state = "PLAY";
  }

  if (keyCode === ENTER && state == "END") {
    state = "PLAY";
  }

  return false;
}