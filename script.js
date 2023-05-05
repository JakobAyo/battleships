const gridCells = document.querySelectorAll('.cpu-player .grid-cell');

gridCells.forEach(gridCell => {
  gridCell.addEventListener('click', (event) => {
    event.target.style.visibility = 'hidden';
  });
});
