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
  for (let i = 0; i < img.data.length; i += 4) {
    grid.push(img.data[i] ? 1 : 0); // convert color → binary
  }
  return grid;
}

