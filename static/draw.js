const canvas = document.getElementById("draw");
const ctx = canvas.getContext("2d");

let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  ctx.fillStyle = "black";
  ctx.fillRect(e.offsetX, e.offsetY, 5, 5);
});

// Converts canvas to grid
function getGrid() {
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const grid = [];

  for (let y = 0; y < canvas.height; y++) {
    const row = [];
    for (let x = 0; x < canvas.width; x++) {
      const idx = 4 * (y * canvas.width + x);
      row.push(img.data[idx] > 0 ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

