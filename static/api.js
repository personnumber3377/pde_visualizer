async function step() {
  const grid = getGrid();
  const response = await fetch("/solve_heat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid, dt: 0.01 })
  });

  const result = await response.json();
  render(result);
}

function render(grid) {
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const v = grid[y][x];
      const idx = 4 * (y * canvas.width + x);

      const c = v * 255;
      img.data[idx] = c;
      img.data[idx+1] = 0;
      img.data[idx+2] = 0;
      img.data[idx+3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
}

async function simulate() {
  const grid = getGrid();
  const response = await fetch("/solve_heat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ grid: grid, dt: 0.1 })
  });

  const newGrid = await response.json();
  render(newGrid);

  // requestAnimationFrame(simulate);
}