const cpuGridCells = document.querySelectorAll('.cpu-player .grid-cell');
const mainGridCells = document.querySelectorAll('.main-player .grid-cell');
const ships = document.querySelectorAll('.ship');

const destroyer = 2
const submarine = 3
const cruiser = 3
const battleship = 4
const carrier = 5

let draggable 
let draggableClass 
let draggableChildren 


let shipClass

let destroyerDataX 
let destroyerDataY 

let submarineDataX
let submarineDataY

let cruiserDataX
let cruiserDataY

let battleshipDataX
let battleshipDataY

let carrierDataX
let carrierDataY


cpuGridCells.forEach(gridCell => {
  gridCell.addEventListener('click', (event) => {
    event.target.style.visibility = 'hidden';
  })
})

ships.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
    draggableClass = document.querySelector('.dragging')
    draggableClass = draggable.classList[1]
    draggableChildren = draggable.children.length

    console.log(draggableClass)
    console.log(draggableChildren)
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

mainGridCells.forEach(cell => {
  cell.addEventListener('dragover', e => {
    e.preventDefault
    draggable = document.querySelector('.dragging')
    cell.appendChild(draggable)
    
    cell.classList.add('hidden')

    console.log(cell.getAttribute('data-x'))
    console.log(cell.getAttribute('data-y'))
    

  })
})

mainGridCells.forEach(cell => {
  cell.addEventListener('dragleave', e => {
    cell.style.visibility = 'visible'
  })
})  