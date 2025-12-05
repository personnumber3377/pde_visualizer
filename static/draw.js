const canvas = document.getElementById("draw");
console.log("Here is the canvas object: ", canvas);
const ctx = canvas.getContext("2d");

MAX_PIXEL_VALUE = 255

let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * canvas.width / rect.width);
  const y = Math.floor((e.clientY - rect.top) * canvas.height / rect.height);

  ctx.fillStyle = "red";
  ctx.fillRect(x, y, 1, 1);
  // console.log("draw at", e.offsetX, e.offsetY);

});
// Converts canvas to grid
function getGrid() {
  // console.log("ctx: ", ctx);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // console.log("Here is the img data: ", img);
  const grid = [];
  
  for (let y = 0; y < canvas.height; y++) {
    const row = [];
    for (let x = 0; x < canvas.width; x++) {
      const idx = 4 * (y * canvas.width + x);
      /*
      if (img.data[idx] != 0) {
        console.log("Non-zero element found!!!");
      }
      */
      //console.log(img.data[idx]);
      row.push(img.data[idx] > 0 ? img.data[idx] / MAX_PIXEL_VALUE : 0); // We need a normalized thing here...
    }
    grid.push(row);
  }
  // console.log("Here is the final grid: ", grid);
  
  return grid; // Just put the thing here??? // grid;
}

