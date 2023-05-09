const cpuGridCells = document.querySelectorAll('.cpu-player .grid-cell');
const mainGridCells = document.querySelectorAll('.main-player .grid-cell');
const ships = document.querySelectorAll('.ship');


cpuGridCells.forEach(gridCell => {
  gridCell.addEventListener('click', (event) => {
    event.target.style.visibility = 'hidden';
  })
})

ships.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

mainGridCells.forEach(cell => {
  cell.addEventListener('dragover', e => {
    e.preventDefault
    const draggable = document.querySelector('.dragging')
    cell.appendChild(draggable)
  })
})