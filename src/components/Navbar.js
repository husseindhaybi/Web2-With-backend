import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";

function NavBar({ cartCount, user, logout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          <i className="bi bi-shop text-warning me-2" style={{ fontSize: "32px" }}></i>
          Delicious Bites
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    <i className="bi bi-house-fill me-1"></i>
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/menu">
                    <i className="bi bi-book-fill me-1"></i>
                    Menu
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/contact">
                    <i className="bi bi-telephone-fill me-1"></i>
                    Contact
                  </Link>
                </li>

                {user.role !== "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      <i className="bi bi-cart-fill me-1"></i>
                      Cart
                      {cartCount > 0 && (
                        <span className="badge bg-danger ms-2">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/orders">
                      <i className="bi bi-gear-fill me-1"></i>
                      Admin
                    </Link>
                  </li>
                )}

                {/* USER DROPDOWN */}
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user.username}
                  </span>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <span className="dropdown-item-text text-muted">
                        {user.role === "admin"
                          ? "Administrator"
                          : "Customer"}
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
