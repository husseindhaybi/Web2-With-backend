import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Admin Panel</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <Link className="nav-link" to="/admin/orders">Orders</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/menu">Menu</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/messages">Messages</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

export default AdminLayout;
