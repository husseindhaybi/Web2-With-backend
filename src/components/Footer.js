import 'bootstrap-icons/font/bootstrap-icons.css';
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Delicious Bites</h5>
            <p>
              Experience the finest cuisine in town. Fresh ingredients,
              authentic flavors, and exceptional service since 2010.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="me-3">
                <i className="bi bi-facebook" style={{ fontSize: "30px", color: "#1877F2" }}></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="me-3">
                <i className="bi bi-instagram" style={{ fontSize: "30px", color: "#E4405F" }}></i>
              </a>
           
            </div>
          </Col>

          <Col md={4} className="mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/home" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/menu" className="text-white text-decoration-none">
                  Menu
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h5 className="mb-3">Contact Info</h5>
            <p>
              <i className="bi bi-geo-alt-fill me-2" style={{ color: "#FFC107" }}></i>
              Minieh
            </p>
            <p>
              <i className="bi bi-telephone-fill me-2" style={{ color: "#28A745" }}></i>
              71874503
            </p>
            <p>
              <i className="bi bi-envelope-fill me-2" style={{ color: "#17A2B8" }}></i>
              husseindhaybi8@gmail.com
            </p>
            <p>
              <i className="bi bi-clock-fill me-2" style={{ color: "#DC3545" }}></i>
              Mon-Fri: 11AM - 10PM
            </p>
          </Col>
        </Row>

        <hr className="bg-white" />

        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; 2025 Delicious Bites. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;