import { useEffect, useState } from "react";
import { Card, Container, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function OrderTracking() {
  const navigate = useNavigate();

  const orderId = localStorage.getItem("currentOrderId");
  const token = localStorage.getItem("token");

  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  // mapping status from DB → step
  const statusMap = {
    pending: 0,
    preparing: 1,
    delivering: 2,
    delivered: 3,
  };

  const statuses = [
    "Order Received",
    "Preparing Your Food",
    "Out for Delivery",
    "Delivered",
  ];

  useEffect(() => {
    // إذا ما في orderId → رجّعو home
    if (!orderId) {
      navigate("/home");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setStatus(data.order.status);
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      } finally {
        setLoading(false);
      }
    };

    // أول fetch
    fetchOrderStatus();

    // polling كل 5 ثواني
    const interval = setInterval(fetchOrderStatus, 5000);

    return () => clearInterval(interval);
  }, [orderId, token, navigate]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <h4>Loading order status...</h4>
      </Container>
    );
  }

  const currentStep = statusMap[status] ?? 0;

  return (
    <Container className="order-tracking-page my-5">
      <h1 className="text-center mb-5">Track Your Order</h1>

      <Card className="shadow mx-auto" style={{ maxWidth: "600px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <div style={{ fontSize: "150px" }}>📦</div>
            <h4>Order ID: {orderId}</h4>
          </div>

          <ProgressBar
            now={((currentStep + 1) / statuses.length) * 100}
            variant="success"
            className="mb-4"
            style={{ height: "25px" }}
          />

          {statuses.map((s, index) => (
            <div
              key={index}
              className={`p-3 mb-2 rounded ${
                index <= currentStep
                  ? "bg-success text-white"
                  : "bg-light"
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>{s}</span>
                {index <= currentStep && <span>✅</span>}
              </div>
            </div>
          ))}

          {status === "delivered" && (
            <div className="alert alert-success mt-4 text-center">
              <strong>Your order has been delivered!</strong>
              <p>Thank you for choosing Delicious Bites!</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default OrderTracking;
