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

let shipSize

let gridCells = document.querySelectorAll('.main-player .grid-cell')
gridCells.forEach(function(cell) {
    cell.addEventListener('dragenter', function(e) {
        Grid.prototype.dragShipEnter(e)
    })
    cell.addEventListener('dragleave', function(e) {
        Grid.prototype.dragShipLeave(e)
    })
}) 

let ships = document.querySelectorAll('.ship')
ships.forEach(function(ship) {
    ship.addEventListener('dragstart', (event) => {
        shipSize = parseInt(event.target.getAttribute('data-size'), 10)
        console.log(shipSize)
    })
})

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

Grid.prototype.dragShipEnter = function(e) {
    
    let direction = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10)
    let size = shipSize

    let x = parseInt(e.target.getAttribute('data-x'), 10)
    let y = parseInt(e.target.getAttribute('data-y'), 10)

    for (let i = 0; i < size; i++) {
        let cell = document.querySelector(`.grid-cell${x}-${y}`)
        cell.classList.add('dragover')
        
        if(direction === 0) {
            y++
        } else {
            x++
        }
    }   
}

Grid.prototype.dragShipLeave = function(e) {
    
    let direction = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10)
    let size = shipSize

    let x = parseInt(e.target.getAttribute('data-x'), 10)
    let y = parseInt(e.target.getAttribute('data-y'), 10)

    for (let i = 0; i < size; i++) {
        let cell = document.querySelector(`.grid-cell${x}-${y}`)
        cell.classList.remove('dragover')
        
        if(direction === 0) {
            y++
        } else {
            x++
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
    this.setCSS
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
            
    this.setCSS
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


