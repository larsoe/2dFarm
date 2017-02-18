const CONF = {
        WIDTH: 700, HEIGHT: 500,
        WORLD: {
          WIDTH: 7, HEIGHT: 5,
        },
        TRACTOR: {
          SPEED: 90
        }
      }
;


let state = "PLAY", menu, tiles, inspector, plantPick = 1, barn={}, tractor,
  images = {}
;

function preload() {
  // images.tractor = loadImage("/img/justtractor.jpg", function() {
  //   console.log("tractor loaded");
  // }, function() {
  //   console.error("Failed to load tractor");
  // });
}

function setup() {
  createCanvas(CONF.WIDTH, CONF.HEIGHT);
  frameRate(60);
  lastFrame = millis();

  menu = new Panel("Select Plant", "actions", "panel");
  menu.add(new Image("img/corn.png", function() {
    plantPick = PLANTS.CORN;
  }));
  menu.add(new Image("img/wheat.png", function() {
    plantPick = PLANTS.WHEAT;
  }));
  menu.add(new Image("img/rhye.png", function() {
    plantPick = PLANTS.RHYE;
  }));
  menu.add(new Image("img/melon.png", function() {
    plantPick = PLANTS.MELON;
  }));
  barn_panel = createDiv(" ").id("barn").class("panel");
  inspector = createDiv(" ").id("inspector").class("panel");

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
  tiles[1][1].type = TILES.ROCK;
  tractor = new Tractor();
}

function draw() {
  deltaTime = (millis() - lastFrame) / 1000;
  lastFrame = millis();
  background(50);
  fill(0);
  noStroke();
  textFont("Arial");

  if (state == "PLAY") {
    for (var x = 0; x < CONF.WORLD.WIDTH; x++) {
      for (var y = 0; y < CONF.WORLD.HEIGHT; y++) {
        tiles[x][y].tick();
      }
    }
    tractor.tick();
    Views.play();
    // menu.show();
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

  barn_panel.html("Wheat: " + barn[PLANTS.WHEAT] + "  Rhye: " + barn[PLANTS.RHYE]
     + "  Melon: " + barn[PLANTS.MELON] + "  Corn: " + barn[PLANTS.CORN]);
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

    tractor.enqueue(createVector(x, y));
  }
}

function keyPressed() {
  if (state == "PLAY" || state == "READY") {
    if (keyCode === UP_ARROW) {
      menu.show();
      menu.show();
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
