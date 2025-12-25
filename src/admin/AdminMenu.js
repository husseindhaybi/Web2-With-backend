import { useEffect, useState } from "react";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Courses",
    image: null
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await fetch("http://localhost:5000/api/admin/menu", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setMenuItems(data.items);
  };

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((k) => {
      if (formData[k]) data.append(k, formData[k]);
    });

    const url = editingItem
      ? `http://localhost:5000/api/admin/menu/${editingItem.id}`
      : "http://localhost:5000/api/admin/menu";

    const method = editingItem ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    setShow(false);
    setEditingItem(null);
    fetchMenu();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete item?")) return;

    await fetch(
      `http://localhost:5000/api/admin/menu/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    fetchMenu();
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="mb-3">Menu</h4>

        <button className="btn btn-success mb-3" onClick={() => setShow(true)}>
          Add Item
        </button>

        <table className="table table-striped">
          <tbody>
            {menuItems.map((i) => (
              <tr key={i.id}>
                <td>
                  <img
                    src={`http://localhost:5000${i.image}`}
                    width="50"
                    alt=""
                  />
                </td>
                <td>{i.name}</td>
                <td>${i.price}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingItem(i);
                      setFormData(i);
                      setShow(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(i.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {show && (
          <form onSubmit={submit}>
            <input className="form-control mb-2" placeholder="Name" onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
            <button className="btn btn-primary">Save</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminMenu;
