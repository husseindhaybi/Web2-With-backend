import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Row } from "react-bootstrap";
import "../styles/menu.css";

function Menu({ addToCart }) {
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notification, setNotification] = useState("");

  const categories = ["All", "Appetizers", "Main Courses", "Desserts", "Drinks"];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch("https://web2-with-backend.onrender.com/api/menu");
      const data = await res.json();
      if (data.success) {
        setMenuData(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  const filteredMenu =
    selectedCategory === "All"
      ? menuData
      : menuData.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotification(`${item.name} added to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <Container className="menu-page my-5">
      <h1 className="text-center mb-4">Our Menu</h1>
      <p className="text-center text-muted mb-5">
        Explore our delicious selection of dishes
      </p>

      {notification && (
        <div className="alert alert-success text-center" role="alert">
          {notification}
        </div>
      )}

      <div className="text-center mb-5">
        <ButtonGroup>
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategory === category
                  ? "warning"
                  : "outline-warning"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <Row>
        {filteredMenu.map((item) => (
          <Col md={6} lg={4} key={item.id} className="mb-4">
            <Card className="h-100 shadow-sm menu-card">
              <Card.Img
                variant="top"
                src={`https://web2-with-backend.onrender.com${item.image}`}
                alt={item.name}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.name}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {item.description}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <h5 className="text-warning mb-0">${item.price}</h5>
                  <Button
                    variant="primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Menu;
