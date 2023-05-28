var CONST = {};

CONST.AVAILABLE_SHIPS = [
  "destroyer",
  "submarine",
  "cruiser",
  "battleship",
  "carrier",
];

CONST.HUMAN_PLAYER = "You";
CONST.COPMUTER_PLAYER = "Computer";

CONST.CSS_EMPTY = "empty";
CONST.CSS_SHIP = "ship";
CONST.CSS_MISS = "miss";
CONST.CSS_HIT = "hit";
CONST.CSS_SUNK = "sunk";

CONST.EMTPY = 0;
CONST.SHIP = 1;
CONST.MISS = 2;
CONST.HIT = 3;
CONST.SUNK = 4;

CONST.GRID_SIZE = 10;

CONST.TOTAL_HITS = 17;

const rotateButton = document.getElementById("rotate-button");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
let humanPlayerGridCells = document.querySelectorAll(
  ".human-player .grid-cell"
);
let cpuPlayerGridCells = document.querySelectorAll(".cpu-player .grid-cell");
let ships = document.querySelectorAll(".ship");

// Global Variables for Eventlisteners
let draggedShip;
let shipSize;
let xPosition;
let yPosition;
// Buttons Event Listeners
rotateButton.addEventListener("click", function (e) {
  mainGame.rotateShip(e);
});

startButton.addEventListener("click", function () {
  mainGame.startGame();
});

restartButton.addEventListener("click", function () {
  window.location.reload();
  return false;
});

// Cell Event Listeners
cpuPlayerGridCells.forEach(function (cell) {
  cell.addEventListener("click", function (e) {
    if (mainGame.gameStartAllowed && mainGame.humanTurn) {
      let x = parseInt(e.target.getAttribute("data-x"), 10);
      let y = parseInt(e.target.getAttribute("data-y"), 10);
      mainGame.shoot(x, y, CONST.COPMUTER_PLAYER);
      mainGame.humanTurn = false;
      mainGame.cycleTurns();
    }
  });
});

humanPlayerGridCells.forEach(function (cell) {
  cell.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });
  cell.addEventListener("dragenter", function (e) {
    e.preventDefault();
    mainGame.humanGrid.dragShipOver(e);
  });
  cell.addEventListener("dragleave", function (e) {
    e.preventDefault();
    mainGame.humanGrid.dragShipOver(e);
  });
  cell.addEventListener("dragover", function (e) {
    e.preventDefault();
  });
  cell.addEventListener("drop", function (e) {
    console.log(draggedShip);
    e.preventDefault();
    let direction = parseInt(rotateButton.getAttribute("data-direction"), 10);
    if (direction === 1) {
      draggedShip.classList.add("vertical");
    } else {
      draggedShip.classList.add("horizontal");
    }
    if (mainGame.humanGrid.isShipPlaceable(xPosition, yPosition, direction)) {
      cell.appendChild(draggedShip);
      mainGame.humanGrid.placeShip(xPosition, yPosition, direction, shipSize);
      mainGame.humanFleet.allShips.forEach((ship) => {
        if (ship.type === draggedShip.classList.item(1)) {
          ship.coordinates(xPosition, yPosition, direction);
        }
      });
    }
  });
});

// Ship Event Listeners
ships.forEach(function (ship) {
  ship.addEventListener("drag", function (e) {
    shipSize = Ship.prototype.dragging(e);
    draggedShip = e.target;
  });
});

function Stats() {
  this.shotsTaken = 0;
  this.shotsHit = 0;
  this.gameWon = false;
}

Stats.prototype.incrementShotsTaken = function () {
  this.shotsTaken++;
};

Stats.prototype.incrementShotsHit = function () {
  this.shotsHit++;
};

Stats.prototype.hasWonGame = function (player) {
  if (this.shotsHit >= CONST.TOTAL_HITS) {
    this.gameWon = true;

    let gameWon = document.querySelector(".game-won");
    gameWon.style.display = "block";

    let displayWinner = document.querySelector(".winner-text");
    displayWinner.textContent = `${player} Won The Game`;
  }
};

// Create a mainGame
function Game() {
  this.humanStats = new Stats();
  this.computerStats = new Stats();
  this.humanGrid = new Grid();
  this.computerGrid = new Grid();
  this.humanFleet = new Fleet(this.humanGrid, CONST.HUMAN_PLAYER);
  this.computerFleet = new Fleet(this.computerGrid, CONST.COPMUTER_PLAYER);

  this.gameStartAllowed = false;

  this.computer = new Computer();
  this.humanTurn = true;
}

Game.prototype.startGame = function () {
  let allShips = this.humanFleet.allShips;

  for (let i = 0; i < allShips.length; i++) {
    if (!allShips[i].placed) {
      this.gameStartAllowed = false;
      break;
    }
    this.gameStartAllowed = true;
  }
  this.computerFleet.placeShipsRandomly();
};

Game.prototype.rotateShip = function () {
  let rotateButtonState = parseInt(
    rotateButton.getAttribute("data-direction"),
    10
  );

  if (rotateButtonState === 0) {
    rotateButton.setAttribute("data-direction", 1);
  } else {
    rotateButton.setAttribute("data-direction", 0);
  }
};

Game.prototype.shoot = function (x, y, targetPlayer) {
  let targetFleet, targetGrid, targetStats;
  let selfStats, selfPlayer;
  let foundShip = false;

  if (targetPlayer === CONST.HUMAN_PLAYER) {
    targetFleet = this.humanFleet;
    targetGrid = this.humanGrid;
    targetStats = this.humanStats;
    selfStats = this.computerStats;
    selfPlayer = CONST.COPMUTER_PLAYER;
  } else {
    targetFleet = this.computerFleet;
    targetGrid = this.computerGrid;
    targetStats = this.computerStats;
    selfStats = this.humanStats;
    selfPlayer = CONST.HUMAN_PLAYER;
  }

  targetFleet.allShips.forEach((ship) => {
    if (ship.getCoordinates(x, y) && targetGrid.cells[x][y] !== CONST.HIT) {
      ship.incrementdamage();
      targetGrid.isHit(x, y, targetPlayer);

      if (targetPlayer === CONST.HUMAN_PLAYER) {
        this.computer.updateProbabilityAfterHit(x, y);
      }

      targetStats.incrementShotsTaken();
      selfStats.incrementShotsHit();
      selfStats.hasWonGame(selfPlayer);

      if (ship.isSunk()) {
        ship.sinkShip();
        targetGrid.isSunk(ship, targetPlayer);
        if (targetPlayer === CONST.HUMAN_PLAYER) {
          this.computer.updateProbabilityAfterSunk();
        }
      }
      foundShip = true;
    }
  });
  if (!foundShip) {
    targetGrid.isMiss(x, y, targetPlayer);

    if (targetPlayer === CONST.HUMAN_PLAYER) {
      this.computer.updateProbabilityAfterMiss(x, y);
      this.xShipLocation = x;
      this.yShipLocation = y;
    }
  }
};

Game.prototype.cycleTurns = function () {
  if (!this.humanTurn) {
    const [xTarget, yTarget] = this.computer.selectNextTarget();
    this.shoot(xTarget, yTarget, CONST.HUMAN_PLAYER);

    this.humanTurn = true;
  }
};
// TODO make the computer shoot ships down
function Computer() {
  this.probabilityGrid = Array.from({ length: 10 }, () => Array(10).fill(0.1)); //set the Prob to 0.1 -> Random
  this.shipLocation = [];
}

Computer.prototype.updateProbabilityAfterHit = function (x, y) {
  this.probabilityGrid[x][y] = 0;

  this.shipLocation.push([x, y]);
  let [xFirst, yFirst] = [this.shipLocation[0][0], this.shipLocation[0][1]];

  let nearbyCells = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];

  if (this.shipLocation.length === 1) {
    nearbyCells.forEach(([cellX, cellY]) => {
      if (
        cellX >= 0 &&
        cellX < CONST.GRID_SIZE &&
        cellY >= 0 &&
        cellY < CONST.GRID_SIZE
      ) {
        this.probabilityGrid[cellX][cellY] *= 2.5; // increase the probability
      }
    });
  }

  if (this.shipLocation.length > 1) {
    if (xFirst === x) {
      nearbyCells = [
        [xFirst, yFirst + 1],
        [xFirst, yFirst - 1],
        [xFirst, y + 1],
        [xFirst, y - 1],
      ];

      nearbyCells.forEach(([cellX, cellY]) => {
        if (
          cellX >= 0 &&
          cellX < CONST.GRID_SIZE &&
          cellY >= 0 &&
          cellY < CONST.GRID_SIZE
        ) {
          this.probabilityGrid[cellX][cellY] *= 5;
        }
      });
    } else if (yFirst === y) {
      nearbyCells = [
        [xFirst + 1, yFirst],
        [xFirst - 1, yFirst],
        [x + 1, yFirst],
        [x - 1, yFirst],
      ];

      nearbyCells.forEach(([cellX, cellY]) => {
        if (
          cellX >= 0 &&
          cellX < CONST.GRID_SIZE &&
          cellY >= 0 &&
          cellY < CONST.GRID_SIZE
        ) {
          this.probabilityGrid[cellX][cellY] *= 5;
        }
      });
    }
  }
};

Computer.prototype.updateProbabilityAfterMiss = function (x, y) {
  this.probabilityGrid[x][y] = 0;

  const nearbyCells = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];

  nearbyCells.forEach(([cellX, cellY]) => {
    if (
      cellX >= 0 &&
      cellX < CONST.GRID_SIZE &&
      cellY >= 0 &&
      cellY < CONST.GRID_SIZE
    ) {
      this.probabilityGrid[cellX][cellY] *= 0.7;
    }
  });
};

Computer.prototype.updateProbabilityAfterSunk = function () {
  this.shipLocation = [];

  for (let x = 0; x < CONST.GRID_SIZE; x++) {
    for (let y = 0; y < CONST.GRID_SIZE; y++) {
      if (this.probabilityGrid[x][y] > 0) {
        this.probabilityGrid[x][y] = 0.1;
      }
    }
  }
};

Computer.prototype.selectNextTarget = function () {
  let maxProbability = -1;
  let maxPorbabilityCells = [];

  for (let x = 0; x < CONST.GRID_SIZE; x++) {
    for (let y = 0; y < CONST.GRID_SIZE; y++) {
      if (this.probabilityGrid[x][y] > maxProbability) {
        maxProbability = this.probabilityGrid[x][y];
        maxPorbabilityCells = [[x, y]];
      } else if (this.probabilityGrid[x][y] === maxProbability) {
        maxPorbabilityCells.push([x, y]);
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * maxPorbabilityCells.length);
  return maxPorbabilityCells[randomIndex];
};

// Create a Grid
function Grid() {
  this.cells = [];
  this.init();
}

Grid.prototype.init = function () {
  for (let x = 0; x < 10; x++) {
    let row = [];
    this.cells[x] = row;
    for (let y = 0; y < 10; y++) {
      row.push(CONST.EMTPY);
    }
  }
};
Grid.prototype.dragShipOver = function (e) {
  let direction = parseInt(rotateButton.getAttribute("data-direction"), 10);
  let size = shipSize;

  let x = parseInt(e.target.getAttribute("data-x"), 10);
  let y = parseInt(e.target.getAttribute("data-y"), 10);
  xPosition = x;
  yPosition = y;

  try {
    if (this.isShipPlaceable(x, y, direction)) {
      for (let i = 0; i < size; i++) {
        let cell = document.querySelector(`.grid-cell${x}-${y}`);
        cell.classList.toggle("ship-cell");

        if (direction === 0) {
          y++;
        } else {
          x++;
        }
      }
    }
  } catch (error) {}
};

Grid.prototype.isShipPlaceable = function (x, y, direction) {
  let size = parseInt(shipSize, 10);

  if (direction === 0) {
    for (let i = 0; i < size; i++) {
      try {
        if (this.cells[x][y + i] === CONST.SHIP) {
          return false;
        }
      } catch (error) {}
    }
    return y + size <= 10;
  } else {
    for (let i = 0; i < size; i++) {
      try {
        if (this.cells[x + i][y] === CONST.SHIP) {
          return false;
        }
      } catch (error) {}
    }
    return x + size <= 10;
  }
};

Grid.prototype.placeShip = function (x, y, direction, size) {
  for (let i = 0; i < size; i++) {
    this.cells[x][y] = CONST.SHIP;

    if (direction === 0) {
      y++;
    } else {
      x++;
    }
  }
};

Grid.prototype.updateCellCSS = function (player) {
  let playerCSS;
  let cell, cellDiv;
  if (player === CONST.HUMAN_PLAYER) {
    playerCSS = ".human-player";
  } else {
    playerCSS = ".cpu-player";
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      cell = this.cells[x][y];
      cellDiv = document.querySelector(`${playerCSS} .grid-cell${x}-${y}`);

      switch (cell) {
        case CONST.SHIP:
          break;
        case CONST.MISS:
          cellDiv.classList.add(CONST.CSS_MISS);
          break;
        case CONST.HIT:
          cellDiv.classList.add(CONST.CSS_HIT);
          break;
        case CONST.SUNK:
          cellDiv.classList.add(CONST.CSS_SUNK);
          cellDiv.classList.remove(CONST.CSS_HIT);
          break;
      }
    }
  }
};

Grid.prototype.appendShipChild = function (x, y, ship) {
  let cell = document.querySelector(`.cpu-player .grid-cell${x}-${y}`);
  let shipDiv = document.createElement("div");
  if (ship.direction === 0) {
    shipDiv.classList.add("ship", ship.type, "horizontal");
  } else {
    shipDiv.classList.add("ship", ship.type, "vertical");
  }
  cell.appendChild(shipDiv);
};

Grid.prototype.isHit = function (x, y, targetPlayer) {
  this.cells[x][y] = CONST.HIT;
  this.updateCellCSS(targetPlayer);
};

Grid.prototype.isMiss = function (x, y, targetPlayer) {
  this.cells[x][y] = CONST.MISS;
  this.updateCellCSS(targetPlayer);
};

Grid.prototype.isSunk = function (ship, targetPlayer) {
  let xPosition = ship.xPosition;
  let yPosition = ship.yPosition;

  for (let i = 0; i < ship.shipLength; i++) {
    this.cells[xPosition[i]][yPosition[i]] = CONST.SUNK;
  }
  this.updateCellCSS(targetPlayer);
  if (targetPlayer === CONST.COPMUTER_PLAYER) {
    this.appendShipChild(xPosition[0], yPosition[0], ship);
  }
};

function Fleet(playerGrid, player) {
  this.numShips = CONST.AVAILABLE_SHIPS.length;
  this.playerGrid = playerGrid;
  this.player = player;
  this.allShips = [];
  this.init();
}

Fleet.prototype.init = function () {
  for (let i = 0; i < this.numShips; i++) {
    this.allShips.push(new Ship(CONST.AVAILABLE_SHIPS[i]));
  }
};

Fleet.prototype.placeShipsRandomly = function () {
  let x, y, direction;

  this.allShips.forEach((ship) => {
    [x, y] = [generateRandomNumber(0, 9), generateRandomNumber(0, 9)];
    direction = generateRandomNumber(0, 1);
    shipSize = ship.shipLength;

    while (!this.playerGrid.isShipPlaceable(x, y, direction)) {
      [x, y] = [generateRandomNumber(0, 9), generateRandomNumber(0, 9)];
      direction = generateRandomNumber(0, 1);
    }
    this.playerGrid.placeShip(x, y, direction, ship.shipLength);
    ship.coordinates(x, y, direction);
  });
};

function Ship(type) {
  this.damageTaken = 0;
  this.type = type;

  switch (type) {
    case CONST.AVAILABLE_SHIPS[0]:
      this.shipLength = 2;
      break;
    case CONST.AVAILABLE_SHIPS[1]:
      this.shipLength = 3;
      break;
    case CONST.AVAILABLE_SHIPS[2]:
      this.shipLength = 3;
      break;
    case CONST.AVAILABLE_SHIPS[3]:
      this.shipLength = 4;
      break;
    case CONST.AVAILABLE_SHIPS[4]:
      this.shipLength = 5;
      break;
    default:
      this.shipLength = 2;
      break;
  }
  this.maxDamage = this.shipLength;
  this.sunk = false;
  this.placed = false;
}

Ship.prototype.coordinates = function (x, y, direction) {
  console.log(x, y, direction);
  this.xPosition = [];
  this.yPosition = [];
  this.direction = direction;

  for (i = 0; i < this.shipLength; i++) {
    if (direction === Ship.DIRECTION_HORIZONTAL) {
      this.xPosition.push(x);
      this.yPosition.push(y + i);
    } else {
      this.xPosition.push(x + i);
      this.yPosition.push(y);
    }
  }
  this.placed = true;
};

Ship.prototype.getCoordinates = function (x, y) {
  for (let i = 0; i < this.xPosition.length; i++) {
    if (x === this.xPosition[i]) {
      if (y === this.yPosition[i]) {
        return true;
      }
    }
  }
  return false;
};

Ship.prototype.incrementdamage = function () {
  this.damageTaken++;
};

Ship.prototype.isSunk = function () {
  return this.damageTaken >= this.maxDamage;
};

Ship.prototype.sinkShip = function () {
  this.damageTaken = this.maxDamage;
  this.sunk = true;
};

Ship.prototype.dragging = function (e) {
  let shipLength = e.target.getAttribute("data-size");
  let direction = parseInt(rotateButton.getAttribute("data-direction"), 10);

  // if (direction === Ship.DIRECTOIN_VERTICAL) {
  //     e.target.classList.add('vertical')
  // } else {
  //     e.target.classList.remove('vertical')
  // }

  return shipLength;
};

Ship.DIRECTION_HORIZONTAL = 0;
Ship.DIRECTOIN_VERTICAL = 1;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var mainGame = new Game();
