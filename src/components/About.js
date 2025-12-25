import { Card, Col, Container, Row } from "react-bootstrap";
import restaurent from '../data/assets/Restaurent.jpeg';

function About() {
  return (
    <Container className="about-page my-5">
      <h1 className="text-center mb-5">About Us</h1>

      <Row className="mb-5">
        <Col md={6}>
          <img
            src={restaurent}
            alt="Restaurant Interior"
            className="img-fluid rounded shadow"
          />
        </Col>
        <Col md={6}>
          <h2>Our Story</h2>
          <p>
            Welcome to Delicious Bites, where culinary excellence meets warm
            hospitality. Since 2010, we have been serving the community with
            passion and dedication to quality.
          </p>
          <p>
            Our chefs use only the freshest ingredients, sourced locally
            whenever possible, to create dishes that delight your taste buds
            and nourish your soul.
          </p>
          <p>
            Whether you're joining us for a casual lunch, a romantic dinner, or
            a special celebration, we promise an unforgettable dining
            experience.
          </p>
        </Col>
      </Row>

      <div className="bg-light p-5 rounded mb-5">
        <h2 className="text-center mb-4">Our Values</h2>
        <Row>
          <Col md={4} className="text-center mb-3">
            <div style={{fontSize: '100px', marginBottom: '20px'}}>✨</div>
            <h4>Quality First</h4>
            <p>We never compromise on the quality of our ingredients</p>
          </Col>
          <Col md={4} className="text-center mb-3">
            <div style={{fontSize: '100px', marginBottom: '20px'}}>😊</div>
            <h4>Customer Focused</h4>
            <p>Your satisfaction is our top priority</p>
          </Col>
          <Col md={4} className="text-center mb-3">
            <div style={{fontSize: '100px', marginBottom: '20px'}}>💡</div>
            <h4>Innovation</h4>
            <p>Constantly evolving our menu with new flavors</p>
          </Col>
        </Row>
      </div>

      <Card className="shadow">
        <Card.Body>
          <h3 className="mb-4">Opening Hours</h3>
          <Row>
            <Col md={6}>
              <p>
                <strong>Monday - Friday:</strong> 11:00 AM - 10:00 PM
              </p>
              <p>
                <strong>Saturday:</strong> 10:00 AM - 11:00 PM
              </p>
              <p>
                <strong>Sunday:</strong> 10:00 AM - 9:00 PM
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Address:</strong>
                <br />
                Minieh Main-Street
                <br />
               Minieh
              </p>
              <p>
                <strong>Phone:</strong> 71874503
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default About;