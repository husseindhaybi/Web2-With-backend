import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("https://web2-with-backend.onrender.com/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setOrders(data.orders);
  };

  const updateOrderStatus = async (id, status) => {
    await fetch(
      `https://web2-with-backend.onrender.com/api/admin/orders/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );
    fetchOrders();
  };

  const badge = (status) => {
    const map = {
      pending: "warning",
      preparing: "info",
      delivering: "primary",
      delivered: "success",
      cancelled: "danger"
    };
    return <span className={`badge bg-${map[status]}`}>{status}</span>;
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="mb-3">Orders</h4>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.username}</td>
                <td>
                  {o.items &&
                    JSON.parse(`[${o.items}]`).map((i, idx) => (
                      <div key={idx}>
                        {i.name} x{i.quantity}
                      </div>
                    ))}
                </td>
                <td>${o.total_amount}</td>
                <td>{badge(o.status)}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={o.status}
                    onChange={(e) =>
                      updateOrderStatus(o.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="delivering">Delivering</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
