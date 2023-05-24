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

const rotateButton = document.getElementById('rotate-button')
const startButton = document.getElementById('start-button')
let humanPlayerGridCells = document.querySelectorAll('.human-player .grid-cell')
let cpuPlayerGridCells = document.querySelectorAll('.cpu-player .grid-cell')
let ships = document.querySelectorAll('.ship')

// Global Variables for Eventlisteners
let draggedShip
let shipSize
let xPosition
let yPosition

// Buttons Event Listeners
rotateButton.addEventListener('click', function(e) {
    mainGame.rotateShip(e)
})

startButton.addEventListener('click', function() {
    mainGame.startGame()
})
// Cell Event Listeners
humanPlayerGridCells.forEach(function(cell) {
    cell.addEventListener('dragstart', function(e) {
        e.preventDefault()
    })
    cell.addEventListener('dragenter', function(e) {
        e.preventDefault()
        mainGame.humanGrid.dragShipOver(e)
    })
    cell.addEventListener('dragleave', function(e) {
        e.preventDefault()
        mainGame.humanGrid.dragShipOver(e)
    })
    cell.addEventListener('dragover', function(e) {
        e.preventDefault()
    })
    cell.addEventListener('drop', function(e) {
        console.log(draggedShip)
        e.preventDefault()
        let direction = parseInt(rotateButton.getAttribute('data-direction'), 10)
        if (direction === 1) {
            draggedShip.classList.add('vertical')
        } else {
            draggedShip.classList.add('horizontal')
        }
        if (mainGame.humanGrid.isShipPlaceable(xPosition, yPosition, direction)){
            cell.appendChild(draggedShip)
            mainGame.humanGrid.shipPlaced(xPosition, yPosition, direction)
        }
    })
}) 

// Ship Event Listeners
ships.forEach(function(ship) {
    ship.addEventListener('drag', function(e) {
        shipSize = Ship.prototype.dragging(e)
        draggedShip = e.target
    })
})

// Create a mainGame
function Game() {
    this.humanGrid = new Grid()
    this.computerGrid = new Grid()
    this.humanFleet = new Fleet(this.humanGrid, CONST.HUMAN_PLAYER)
    this.computerFleet = new Fleet(this.computerFleet, CONST.COPMUTER_PLAYER)
}

Game.prototype.rotateShip = function() {
    let rotateButtonState = parseInt(rotateButton.getAttribute('data-direction'), 10)
    
    if (rotateButtonState === 0) {
        rotateButton.setAttribute('data-direction', 1)
    } else {
        rotateButton.setAttribute('data-direction', 0)
    }
}


// Create a Grid 
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
Grid.prototype.dragShipOver = function(e) {
    
    let direction = parseInt(rotateButton.getAttribute('data-direction'), 10)
    let size = shipSize

    let x = parseInt(e.target.getAttribute('data-x'), 10)
    let y = parseInt(e.target.getAttribute('data-y'), 10)
    xPosition = x
    yPosition = y

    try {
        if(this.isShipPlaceable(x, y, direction)) {
            for (let i = 0; i < size; i++) {
                let cell = document.querySelector(`.grid-cell${x}-${y}`)            
                cell.classList.toggle('ship')
    
                if(direction === 0) {
                    y++
                } else {
                    x++
                }
            }
        }
    } catch (error){}
}


Grid.prototype.isShipPlaceable = function(x, y, direction) {
    let size = parseInt(shipSize, 10)
   

    if (direction === 0){
        for (let i = 0 ; i < size; i++){
            if(this.cells[x][y + i] === CONST.SHIP) {
                return false
            }
        }
        return y + size <= 10
    } else {
        for (let i = 0; i < size; i++){
            if(this.cells[x + i][y] === CONST.SHIP) {
                return false
            }
        }
        return x + size <= 10
    }
}

Grid.prototype.shipPlaced = function(x, y, direction){
    let size = shipSize

    for (let i = 0; i < size; i++){
        this.cells[x][y] = CONST.SHIP

        if (direction === 0) {
            y++
        } else {
            x++
        }
    }
}

// Grid.prototype.setCSS = function(player) {
//     let playerCSS
//     if (player === CONST.HUMAN_PLAYER){
//         playerCSS = '.human-player'
//     } else {
//         playerCSS = '.cpu-player'
//     }
//     for (let x = 0; x < 10; x++){
//         for (let y = 0; y < 10; y++) {
//             let cell = this.cells[x][y]
            
//             let cssCell = document.querySelector(`${playerCSS} .grid-cell${x}-${y}`)
            
//             switch (cell) {
//                 case CONST.EMTPY:
//                     cssCell.classList.add(CONST.CSS_EMPTY)
//                     break
//                 case CONST.SHIP:
//                     cssCell.classList.add(CONST.CSS_SHIP)
//                     break
//                 case CONST.MISS:
//                     cssCell.classList.add(CONST.CSS_MISS)
//                     break
//                 case CONST.HIT:
//                     cssCell.classList.add(CONST.CSS_HIT)
//                     break
//                 case CONST.SUNK:
//                     cssCell.classList.add(CONST.SUNK)
//                     break
//             }
//         }
//     }
// }

function Fleet(playerGrid, player) {
    this.numShips = CONST.AVAILABLE_SHIPS
    this.playerGrid = playerGrid
    this.player = player
}

function Ship(type, playerGrid, player) {
    this.damageTaken = 0
    this.type = type
    this.playerGrid = playerGrid
    this.player = player

    switch (type) {
        case CONST.AVAILABLE_SHIPS[0]:
            this.shipLength = 2
            break
        case CONST.AVAILABLE_SHIPS[1]:
            this.shipLength = 3
            break
        case CONST.AVAILABLE_SHIPS[2]:
            this.shipLength = 3
            break
        case CONST.AVAILABLE_SHIPS[3]:
            this.shipLength = 4
            break
        case CONST.AVAILABLE_SHIPS[4]:
            this.shipLength = 5
            break
        default:
            this.shipLength = 2
            break
    }
    this.maxDamage = this.shipLength
    this.sunk = false
}

Ship.prototype.dragging = function(e) {
    let shipLength = e.target.getAttribute('data-size')
    let direction = parseInt(rotateButton.getAttribute('data-direction'), 10)

    if (direction === 1) {
        e.target.classList.add('vertical')
    } else {
        e.target.classList.remove('vertical')
    }

    return shipLength
}

Ship.DIRECTION_HORIZONTAL = 0
Ship.DIRECTOIN_VERTICAL = 1

var mainGame = new Game()
