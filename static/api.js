async function step() {
  const grid = getGrid();
  const side = canvas.width;
  const response = await fetch("/solve_heat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid, dt: 0.01 })
  });

  const result = await response.json();

  // render heatmap
  render(result);
}

