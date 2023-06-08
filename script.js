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

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const MainGame = {
  AVAILABLE_SHIPS: [
    "destroyer",
    "submarine",
    "cruiser",
    "battleship",
    "carrier",
  ],

  HUMAN_PLAYER: "You",
  COPMUTER_PLAYER: "Computer",

  CSS_EMPTY: "empty",
  CSS_SHIP: "ship",
  CSS_MISS: "miss",
  CSS_HIT: "hit",
  CSS_SUNK: "sunk",

  EMPTY: 0,
  SHIP: 1,
  MISS: 2,
  HIT: 3,
  SUNK: 4,

  HORIZONTAL: 0,
  VERTICAL: 1,

  GRID_SIZE: 10,

  TOTAL_HITS: 17,

  Stats: function () {
    this.shotsTaken = 0;
    this.shotsHit = 0;
    this.gameWon = false;

    this.incrementShotsHit = function () {
      this.shotsTaken++;
    };

    this.incrementShotsHit = function () {
      this.shotsHit++;
    };

    this.hasWonGame = function (player) {
      if (this.shotsHit >= this.TOTAL_HITS) {
        this.gameWon = true;

        let gameWon = document.querySelector(".game-won");
        gameWon.style.display = "block";

        let displayWinner = document.querySelector(".winner-text");
        displayWinner.textContent = `${player} Won The Game`;
      }
    };
  },

  Game: function () {
    this.humanStats = new MainGame.Stats();
    this.computerStats = new MainGame.Stats();
    this.humanGrid = new MainGame.Grid();
    this.computerGrid = new MainGame.Grid();
    this.humanFleet = new MainGame.Fleet(this.humanGrid, this.HUMAN_PLAYER);
    this.computerFleet = new MainGame.Fleet(
      this.computerGrid,
      this.COPMUTER_PLAYER
    );

    this.gameStartAllowed = false;

    this.computer = new MainGame.Computer();
    this.humanTurn = true;

    this.startGame = function () {
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

    this.rotateShip = function () {
      let rotateButtonState = parseInt(
        rotateButton.getAttribute("data-direction"),
        10
      );

      if (rotateButtonState === this.HORIZONTAL) {
        rotateButton.setAttribute("data-direction", 1);
      } else {
        rotateButton.setAttribute("data-direction", 0);
      }
    };

    this.shoot = function (x, y, targetPlayer) {
      let targetFleet, targetGrid, targetStats;
      let selfStats, selfPlayer;
      let foundShip = false;

      if (targetPlayer === this.HUMAN_PLAYER) {
        targetFleet = this.humanFleet;
        targetGrid = this.humanGrid;
        targetStats = this.humanStats;
        selfStats = this.computerStats;
        selfPlayer = this.COPMUTER_PLAYER;
      } else {
        targetFleet = this.computerFleet;
        targetGrid = this.computerGrid;
        targetStats = this.computerStats;
        selfStats = this.humanStats;
        selfPlayer = this.HUMAN_PLAYER;
      }

      targetFleet.allShips.forEach((ship) => {
        if (ship.getCoordinates(x, y) && targetGrid.cells[x][y] !== this.HIT) {
          ship.incrementdamage();
          targetGrid.isHit(x, y, targetPlayer);

          if (targetPlayer === this.HUMAN_PLAYER) {
            this.computer.updateProbabilityAfterHit(x, y);
          }

          targetStats.incrementShotsTaken();
          selfStats.incrementShotsHit();
          selfStats.hasWonGame(selfPlayer);

          if (ship.isSunk()) {
            ship.sinkShip();
            targetGrid.isSunk(ship, targetPlayer);
            if (targetPlayer === this.HUMAN_PLAYER) {
              this.computer.updateProbabilityAfterSunk();
            }
          }
          foundShip = true;
        }
      });
      if (!foundShip) {
        targetGrid.isMiss(x, y, targetPlayer);

        if (targetPlayer === this.HUMAN_PLAYER) {
          this.computer.updateProbabilityAfterMiss(x, y);
          this.xShipLocation = x;
          this.yShipLocation = y;
        }
      }
    };

    this.cycleTurns = function () {
      if (!this.humanTurn) {
        const [xTarget, yTarget] = this.computer.selectNextTarget();
        this.shoot(xTarget, yTarget, this.HUMAN_PLAYER);

        this.humanTurn = true;
      }
    };
  },

  Grid: function () {
    this.cells = [];

    this.init = function () {
      for (let x = 0; x < 10; x++) {
        let row = [];
        this.cells[x] = row;
        for (let y = 0; y < 10; y++) {
          row.push(this.EMTPY);
        }
      }
    };

    this.init();

    this.isShipPlaceable = function (x, y, direction) {
      let size = parseInt(shipSize, 10);

      if (direction === 0) {
        for (let i = 0; i < size; i++) {
          try {
            if (this.cells[x][y + i] === this.SHIP) {
              return false;
            }
          } catch (error) {}
        }
        return y + size <= 10;
      } else {
        for (let i = 0; i < size; i++) {
          try {
            if (this.cells[x + i][y] === this.SHIP) {
              return false;
            }
          } catch (error) {}
        }
        return x + size <= 10;
      }
    };

    this.placeShip = function (x, y, direction, size) {
      for (let i = 0; i < size; i++) {
        this.cells[x][y] = this.SHIP;

        if (direction === 0) {
          y++;
        } else {
          x++;
        }
      }
    };

    this.dragShipOver = function (e) {
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

            if (direction === this.HORIZONTAL) {
              y++;
            } else {
              x++;
            }
          }
        }
      } catch (error) {}
    };

    this.updateCellCSS = function (player) {
      let playerCSS;
      let cell, cellDiv;
      if (player === this.HUMAN_PLAYER) {
        playerCSS = ".human-player";
      } else {
        playerCSS = ".cpu-player";
      }

      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          cell = this.cells[x][y];
          cellDiv = document.querySelector(`${playerCSS} .grid-cell${x}-${y}`);

          switch (cell) {
            case this.SHIP:
              break;
            case this.MISS:
              cellDiv.classList.add(this.CSS_MISS);
              break;
            case this.HIT:
              cellDiv.classList.add(this.CSS_HIT);
              break;
            case this.SUNK:
              cellDiv.classList.add(this.CSS_SUNK);
              cellDiv.classList.remove(this.CSS_HIT);
              break;
          }
        }
      }
    };

    this.appendShipChild = function (x, y, ship) {
      let cell = document.querySelector(`.cpu-player .grid-cell${x}-${y}`);
      let shipDiv = document.createElement("div");
      if (ship.direction === this.HORIZONTAL) {
        shipDiv.classList.add("ship", ship.type, "horizontal");
      } else {
        shipDiv.classList.add("ship", ship.type, "vertical");
      }
      cell.appendChild(shipDiv);
    };

    this.isHit = function (x, y, targetPlayer) {
      this.cells[x][y] = this.HIT;
      this.updateCellCSS(targetPlayer);
    };

    this.isMiss = function (x, y, targetPlayer) {
      this.cells[x][y] = this.MISS;
      this.updateCellCSS(targetPlayer);
    };

    this.isSunk = function (ship, targetPlayer) {
      let xPosition = ship.xPosition;
      let yPosition = ship.yPosition;

      for (let i = 0; i < ship.shipLength; i++) {
        this.cells[xPosition[i]][yPosition[i]] = this.SUNK;
      }
      this.updateCellCSS(targetPlayer);
      if (targetPlayer === this.COPMUTER_PLAYER) {
        this.appendShipChild(xPosition[0], yPosition[0], ship);
      }
    };
  },

  Fleet: function (player) {
    this.numShips = MainGame.AVAILABLE_SHIPS.length;
    this.playerGrid = playerGrid;
    this.player = player;
    this.allShips = [];

    this.init = function () {
      for (let i = 0; i < this.numShips; i++) {
        this.allShips.push(new Ship(this.AVAILABLE_SHIPS[i]));
      }
    };

    this.init();

    this.placeShipsRandomly = function () {
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
  },

  Ship: function (type) {
    this.damageTaken = 0;
    this.type = type;

    switch (type) {
      case this.AVAILABLE_SHIPS[0]:
        this.shipLength = 2;
        break;
      case this.AVAILABLE_SHIPS[1]:
        this.shipLength = 3;
        break;
      case this.AVAILABLE_SHIPS[2]:
        this.shipLength = 3;
        break;
      case this.AVAILABLE_SHIPS[3]:
        this.shipLength = 4;
        break;
      case this.AVAILABLE_SHIPS[4]:
        this.shipLength = 5;
        break;
      default:
        this.shipLength = 2;
        break;
    }

    this.maxDamage = this.shipLength;
    this.sunk = false;
    this.placed = false;

    this.coordinates = function (x, y, direction) {
      console.log(x, y, direction);
      this.xPosition = [];
      this.yPosition = [];
      this.direction = direction;

      for (i = 0; i < this.shipLength; i++) {
        if (direction === this.HORIZONTAL) {
          this.xPosition.push(x);
          this.yPosition.push(y + i);
        } else {
          this.xPosition.push(x + i);
          this.yPosition.push(y);
        }
      }
      this.placed = true;
    };

    this.getCoordinates = function (x, y) {
      for (let i = 0; i < this.xPosition.length; i++) {
        if (x === this.xPosition[i]) {
          if (y === this.yPosition[i]) {
            return true;
          }
        }
      }
      return false;
    };

    this.incrementDamage = function () {
      this.damageTaken++;
    };

    this.isSunk = function () {
      return this.damageTaken >= this.maxDamage;
    };

    this.sinkShip = function () {
      this.damageTaken = this.maxDamage;
      this.sunk = true;
    };

    this.dragging = function (e) {
      let shipLength = e.target.getAttribute("data-size");
      let direction = parseInt(rotateButton.getAttribute("data-direction"), 10);

      return shipLength;
    };
  },

  Computer: function () {
    this.probabilityGrid = Array.from({ length: 10 }, () =>
      Array(10).fill(0.1)
    ); //set the Prob to 0.1 -> Random
    this.shipLocation = [];

    this.updateProbabilityAfterHit = function (x, y) {
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
            cellX < this.GRID_SIZE &&
            cellY >= 0 &&
            cellY < this.GRID_SIZE
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
              cellX < this.GRID_SIZE &&
              cellY >= 0 &&
              cellY < this.GRID_SIZE
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
              cellX < this.GRID_SIZE &&
              cellY >= 0 &&
              cellY < this.GRID_SIZE
            ) {
              this.probabilityGrid[cellX][cellY] *= 5;
            }
          });
        }
      }
    };

    this.updateProbabilityAfterMiss = function (x, y) {
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
          cellX < this.GRID_SIZE &&
          cellY >= 0 &&
          cellY < this.GRID_SIZE
        ) {
          this.probabilityGrid[cellX][cellY] *= 0.7;
        }
      });
    };

    this.updateProbabilityAfterSunk = function () {
      this.shipLocation = [];

      for (let x = 0; x < this.GRID_SIZE; x++) {
        for (let y = 0; y < this.GRID_SIZE; y++) {
          if (this.probabilityGrid[x][y] > 0) {
            this.probabilityGrid[x][y] = 0.1;
          }
        }
      }
    };

    this.selectNextTarget = function () {
      let maxProbability = -1;
      let maxPorbabilityCells = [];

      for (let x = 0; x < this.GRID_SIZE; x++) {
        for (let y = 0; y < this.GRID_SIZE; y++) {
          if (this.probabilityGrid[x][y] > maxProbability) {
            maxProbability = this.probabilityGrid[x][y];
            maxPorbabilityCells = [[x, y]];
          } else if (this.probabilityGrid[x][y] === maxProbability) {
            maxPorbabilityCells.push([x, y]);
          }
        }
      }

      const randomIndex = Math.floor(
        Math.random() * maxPorbabilityCells.length
      );
      return maxPorbabilityCells[randomIndex];
    };
  },
};

const game = new MainGame.Game();

// Buttons Event Listeners
rotateButton.addEventListener("click", function (e) {
  game.rotateShip(e);
});

startButton.addEventListener("click", function () {
  game.startGame();
});

restartButton.addEventListener("click", function () {
  window.location.reload();
  return false;
});

// Cell Event Listeners
cpuPlayerGridCells.forEach(function (cell) {
  cell.addEventListener("click", function (e) {
    if (game.gameStartAllowed && game.humanTurn) {
      let x = parseInt(e.target.getAttribute("data-x"), 10);
      let y = parseInt(e.target.getAttribute("data-y"), 10);
      game.shoot(x, y, this.COPMUTER_PLAYER);
      game.humanTurn = false;
      game.cycleTurns();
    }
  });
});

humanPlayerGridCells.forEach(function (cell) {
  cell.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });
  cell.addEventListener("dragenter", function (e) {
    e.preventDefault();
    game.humanGrid.dragShipOver(e);
  });
  cell.addEventListener("dragleave", function (e) {
    e.preventDefault();
    game.humanGrid.dragShipOver(e);
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
    if (game.humanGrid.isShipPlaceable(xPosition, yPosition, direction)) {
      cell.appendChild(draggedShip);
      game.humanGrid.placeShip(xPosition, yPosition, direction, shipSize);
      game.humanFleet.allShips.forEach((ship) => {
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
