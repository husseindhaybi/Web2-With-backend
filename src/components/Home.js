import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import restaurent from '../data/assets/Restaurent.jpeg';
import "../styles/home.css";

function Home() {
  const [featuredDishes, setFeaturedDishes] = useState([]);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch('https://web2-with-backend.onrender.com/api/menu');
      const data = await res.json();
      if (data.success) {
        setFeaturedDishes(data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-3 fw-bold text-white">
                Welcome to Delicious Bites
              </h1>
              <p className="lead text-white mb-4">
                Experience the finest cuisine in town.
              </p>
              <Button as={Link} to="/menu" variant="warning" size="lg">
                View Menu
              </Button>
            </Col>
            <Col lg={6}>
              <img
                src={restaurent}
                alt="Restaurant"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-5">
        <h2 className="text-center mb-5">Featured Dishes</h2>
        <Row>
          {featuredDishes.map((dish) => (
            <Col md={4} key={dish.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={`https://web2-with-backend.onrender.com${dish.image}`}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{dish.name}</Card.Title>
                  <Card.Text>{dish.description}</Card.Text>
                  <h5 className="text-warning">${dish.price}</h5>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4">
          <Button as={Link} to="/menu" variant="primary" size="lg">
            See Full Menu
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Home;
