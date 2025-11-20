from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import os

app = Flask(__name__, static_url_path="", static_folder="../static")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/solve_heat", methods=["POST"])
def solve_heat():
    data = request.json
    u = np.array(data["grid"])
    dt = data.get("dt", 0.01)

    # simple 5-point stencil laplacian
    laplace = (
        np.roll(u, 1, axis=0) +
        np.roll(u, -1, axis=0) +
        np.roll(u, 1, axis=1) +
        np.roll(u, -1, axis=1) -
        4 * u
    )

    u_next = u + dt * laplace
    return jsonify(u_next.tolist())

if __name__ == "__main__":
    app.run(debug=True)
