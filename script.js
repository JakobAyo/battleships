const cpuGridCells = document.querySelectorAll('.cpu-player .grid-cell')
const mainGridCells = document.querySelectorAll('.main-player .grid-cell')
const ships = document.querySelectorAll('.ship')

const rotateButton = document.querySelector('#rotate-button')

const destroyer = 2
const submarine = 3
const cruiser = 3
const battleship = 4
const carrier = 5


// clicking hides the cell
cpuGridCells.forEach(gridCell => {
  gridCell.addEventListener('click', (event) => {
    event.target.style.visibility = 'hidden'
  })
})


ships.forEach(ship => {
  ship.addEventListener('dragstart', handleDragStart)
  ship.addEventListener('dragend', handleDragEnd)
})

mainGridCells.forEach(cell => {
  cell.addEventListener('dragenter', handleDragEnter)
  cell.addEventListener('dragover', handleDragOver)
  cell.addEventListener('dragleave', handleDragLeave)
  cell.addEventListener('drop', handleDrop)
})

function handleDragStart(event) {
  event.currentTarget.classList.add('dragging')
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove('dragging')
}

function handleDragEnter(event) {
  event.preventDefault()
}

function handleDragOver(event) {
  event.preventDefault()
}

function handleDragLeave(event) {
  const index = dragEnteredCells.indexOf(event.currentTarget)
  if(index > -1) {
    dragEnteredCells.splice(index, 1)
  }
}

function handleDrop(event) {
  event.preventDefault()
  
}