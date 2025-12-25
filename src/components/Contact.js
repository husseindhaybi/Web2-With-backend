import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (data.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 3000);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to send message. Please try again.');
  }
};

  return (
    <Container className="contact-page my-5">
      <h1 className="text-center mb-5">Contact Us</h1>

      {submitted && (
        <div className="alert alert-success text-center" role="alert">
          Thank you for contacting us! We will get back to you soon.
        </div>
      )}

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Body>
              <h3 className="mb-4">Send us a Message</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message..."
                  />
                </Form.Group>

                <Button variant="primary" type="submit" size="lg" className="w-100">
                  Send Message
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow mb-4">
            <Card.Body>
              <h3 className="mb-4">Contact Information</h3>
              <div className="mb-4 d-flex align-items-start">
                <i className="bi bi-geo-alt-fill text-danger me-3" style={{ fontSize: '30px' }}></i>
                <div>
                  <strong>Address:</strong>
                  <p className="mb-0">Minieh</p>
                </div>
              </div>
              <div className="mb-4 d-flex align-items-start">
                <i className="bi bi-telephone-fill text-success me-3" style={{ fontSize: '30px' }}></i>
                <div>
                  <strong>Phone:</strong>
                  <p className="mb-0">71874503</p>
                </div>
              </div>
              <div className="mb-4 d-flex align-items-start">
                <i className="bi bi-envelope-fill text-primary me-3" style={{ fontSize: '30px' }}></i>
                <div>
                  <strong>Email:</strong>
                  <p className="mb-0">husseindhaybi8@gmail.com</p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <i className="bi bi-clock-fill text-warning me-3" style={{ fontSize: '30px' }}></i>
                <div>
                  <strong>Hours:</strong>
                  <p className="mb-0">Mon-Fri: 11AM - 10PM<br/>Sat-Sun: 10AM - 11PM</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;