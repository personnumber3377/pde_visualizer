from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import sympy as sp

app = Flask(__name__, static_url_path="", static_folder="../static")

# ===== Symbolic heat solution setup =====
x, y, t = sp.symbols('x y t', real=True)
kappa = sp.symbols('kappa', positive=True)
sigma0 = sp.symbols('sigma0', positive=True)

# Radial Gaussian solution of 2D heat equation
u_expr = (sigma0**2 / (sigma0**2 + 4*kappa*t)) * sp.exp(
    - (x**2 + y**2) / (sigma0**2 + 4*kappa*t)
)

# Turn into a fast numerical function (NumPy)
u_sym_num = sp.lambdify((x, y, t, kappa, sigma0), u_expr, "numpy")


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/solve_heat", methods=["POST"])
def solve_heat():
    data = request.json
    print("Got this grid here: "+str(data["grid"]))
    u = np.array(data["grid"])
    
    laplace = np.zeros_like(u)

    dt = data.get("dt", 0.01)

    laplace[1:-1,1:-1] = (
        u[:-2,1:-1] +
        u[2:,1:-1] +
        u[1:-1,:-2] +
        u[1:-1,2:] -
        4 * u[1:-1,1:-1]
    )

    print("Returning this here: "+str((u + dt * laplace).tolist()))

    return jsonify((u + dt * laplace).tolist())

def symbolic_heat_grid(t_value, nx=50, ny=50, L=1.0,
                       kappa_value=1.0, sigma0_value=0.1):
    """
    Sample the symbolic solution on an nx×ny grid over [-L, L] × [-L, L].
    Returns a numpy array in [0, 1].
    """
    xs = np.linspace(-L, L, nx)
    ys = np.linspace(-L, L, ny)
    X, Y = np.meshgrid(xs, ys)

    U = u_sym_num(X, Y, t_value, kappa_value, sigma0_value)

    # Normalize to [0, 1] for visualization
    U = U - U.min()
    max_val = U.max()
    if max_val > 0:
        U = U / max_val
    return U

@app.route("/symbolic_heat")
def symbolic_heat():
    # t comes from query string: /symbolic_heat?t=0.1
    t_value = float(request.args.get("t", "0.0"))

    # 50x50 grid to match your canvas
    U = symbolic_heat_grid(t_value, nx=50, ny=50, L=100.0,
                           kappa_value=1000.0, sigma0_value=10.00)
    return jsonify(U.tolist())

if __name__ == "__main__":
    app.run(debug=True)