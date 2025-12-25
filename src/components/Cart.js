import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

function Cart({ cartItems, updateQuantity, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const token = localStorage.getItem('token');

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    if (!token) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        items: cartItems,
        total_amount: parseFloat(calculateTotal()) + 5
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("currentOrderId", data.orderId);
        clearCart();
        setOrderPlaced(true);
        
        setTimeout(() => {
          navigate("/order-tracking");
        }, 2000);
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <Container className="my-5 text-center">
        <div className="alert alert-success">
          <h2>Order Placed Successfully!</h2>
          <p>Redirecting to order tracking...</p>
        </div>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <i 
          className="bi bi-cart-x mb-4" 
          style={{ fontSize: "150px", color: "#6c757d" }}
        ></i>
        <h2>Your Cart is Empty</h2>
        <p className="text-muted">Add some delicious items to get started!</p>
        <Button variant="primary" onClick={() => navigate("/menu")}>
          Browse Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container className="cart-page my-5">
      <h1 className="mb-4">Your Cart</h1>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            width="60"
                            height="60"
                            className="rounded me-3"
                            style={{ objectFit: "cover" }}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <div className="quantity-controls">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span className="mx-3">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-4">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>$5.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total:</strong>
                <strong className="text-warning">
                  ${(parseFloat(calculateTotal()) + 5).toFixed(2)}
                </strong>
              </div>
              <Button
                variant="success"
                size="lg"
                className="w-100 mb-2"
                onClick={handleCheckout}
              >
                Place Order
              </Button>
              <Button
                variant="outline-danger"
                size="lg"
                className="w-100"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;