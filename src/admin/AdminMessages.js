import { useEffect, useState } from "react";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch(
      "https://web2-with-backend.onrender.com/api/admin/messages",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const data = await res.json();
    if (data.success) setMessages(data.messages);
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await fetch(
      `https://web2-with-backend.onrender.com/api/admin/messages/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    fetchMessages();
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="mb-3">Contact Messages</h4>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td style={{ maxWidth: "300px" }}>{m.message}</td>
                <td>{new Date(m.created_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMessage(m.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <p className="text-muted text-center">No messages yet.</p>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
