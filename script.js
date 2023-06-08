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
    this.humanStats = new this.Stats();
    this.computerStats = new this.Stats();
  },

  Grid: function () {
    this.cells = [];

    this.init = function () {
      for (let x = 0; x < 10; x++) {
        let row = [];
        this.cells[x] = row;
        for (let y = 0; y < 10; y++) {
          row.push(CONST.EMTPY);
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

            if (direction === 0) {
              y++;
            } else {
              x++;
            }
          }
        }
      } catch (error) {}
    };
  },

  Fleet: function () {},

  Computer: function () {},

  Ship: function (type) {},
};

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
