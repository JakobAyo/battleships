var CONST = {}

CONST.AVAILABLE_SHIPS = ['destroyer', 'submarine', 'cruiser', 'battleship', 'carrier']

CONST.HUMAN_PLAYER = 0
CONST.COPMUTER_PLAYER = 1

CONST.CSS_EMPTY = 'empty'
CONST.CSS_SHIP = 'ship'
CONST.CSS_MISS = 'miss'
CONST.CSS_HIT = 'hit'
CONST.CSS_SUNK = 'sunk'

CONST.EMTPY = 0
CONST.SHIP = 1
CONST.MISS = 2
CONST.HIT = 3
CONST.SUNK = 4


function Game() {
    this.humanGrid = new Grid()
    this.computerGrid = new Grid()
    this.humanFleet = new Fleet(this.humanGrid, CONST.HUMAN_PLAYER)
    this.computerFleet = new Fleet(this.computerFleet, CONST.COPMUTER_PLAYER)
}


function Grid() {
    this.cells = []
    this.init()
}


Grid.prototype.init = function() {
    for (let x = 0; x < 10; x++) {
        let row = []
        this.cells[x] = row
        for (let y = 0; y < 10; y++) {
            row.push(CONST.EMTPY)
        }
    }

}

Grid.prototype.updateCell = function(x, y, shipType) {
    let player
    
    switch (shipType) {
        case CONST.CSS_EMPTY:
            this.cells[x][y] = CONST.EMTPY
            break
        case CONST.CSS_SHIP:
            this.cells[x][y] = CONST.SHIP
            break
        case CONST.CSS_MISS:
            this.cells[x][y] = CONST.MISS
            break
        case CONST.CSS_HIT:
            this.cells[x][y] = CONST.HIT
            break
        case CONST.CSS_SUNK:
            this.cells[x][y] = CONST.SUNK
            break
        default:
            this.cells[x][y] = CONST.EMTPY
            break
    }
}

Grid.prototype.setCSS = function(player) {
    let playerCSS
    if (player === CONST.HUMAN_PLAYER){
        playerCSS = '.main-player'
    } else {
        playerCSS = '.cpu-player'
    }
    for (let x = 0; x < 10; x++){
        for (let y = 0; y < 10; y++) {
            let cell = this.cells[x][y]
            
            let cssCell = document.querySelector(`${playerCSS} .grid-cell${x}-${y}`)
            
            switch (cell) {
                case CONST.EMTPY:
                    cssCell.classList.add(CONST.CSS_EMPTY)
                    break
                case CONST.SHIP:
                    cssCell.classList.add(CONST.CSS_SHIP)
                    break
                case CONST.MISS:
                    cssCell.classList.add(CONST.CSS_MISS)
                    break
                case CONST.HIT:
                    cssCell.classList.add(CONST.CSS_HIT)
                    break
                case CONST.SUNK:
                    cssCell.classList.add(CONST.SUNK)
                    break
            }
        }
    }
}

function Fleet(playerGrid, player) {
    this.numShips = CONST.AVAILABLE_SHIPS
    this.playerGrid = playerGrid
    this.player = player
}

var game = new Game()

game.humanGrid.updateCell(3, 1, 'miss')
game.humanGrid.updateCell(0, 2, 'miss')
game.humanGrid.updateCell(6, 3, 'miss')
game.humanGrid.updateCell(0, 4, 'miss')
game.humanGrid.updateCell(0, 5, 'miss')
game.humanGrid.updateCell(1, 6, 'miss')
game.humanGrid.updateCell(0, 7, 'miss')
game.humanGrid.setCSS()

game.computerGrid.updateCell(0, 0, 'miss')
game.computerGrid.setCSS()