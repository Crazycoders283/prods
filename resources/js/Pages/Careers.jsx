import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Navbar from './Common/Navbar';
import Footer from './Common/Footer';
import withPageElements from './Common/PageWrapper';

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Travel Consultant",
      department: "Sales",
      location: "Tracy, CA",
      type: "Full-time",
      description: "We're looking for experienced travel consultants who are passionate about cruises and can provide exceptional service to our clients.",
      requirements: [
        "At least 2 years of experience in the travel industry",
        "Excellent communication and interpersonal skills",
        "Knowledge of cruise lines and destinations",
        "Strong sales and customer service skills",
        "Ability to work in a fast-paced environment"
      ]
    },
    {
      id: 2,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Join our marketing team to help grow our online presence and attract more customers to our cruise booking platform.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "2+ years of experience in digital marketing",
        "Experience with SEO, SEM, and social media marketing",
        "Strong analytical skills and experience with marketing tools",
        "Excellent written and verbal communication skills"
      ]
    },
    {
      id: 3,
      title: "Web Developer",
      department: "IT",
      location: "Remote",
      type: "Full-time",
      description: "We're seeking a skilled web developer to help maintain and improve our booking platform and website.",
      requirements: [
        "3+ years of experience in web development",
        "Proficiency in React, Laravel, and modern web technologies",
        "Experience with responsive design and mobile-first approach",
        "Strong problem-solving skills",
        "Ability to work independently and as part of a team"
      ]
    },
    {
      id: 4,
      title: "Customer Support Representative",
      department: "Customer Service",
      location: "Tracy, CA",
      type: "Full-time",
      description: "Help our customers have the best experience by providing exceptional support throughout their booking journey.",
      requirements: [
        "Previous customer service experience",
        "Excellent communication skills",
        "Problem-solving ability",
        "Patient and empathetic attitude",
        "Experience with CRM software a plus"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Careers - JETSETTERS</title>
        <meta name="description" content="Join our team at JETSETTERS and help create unforgettable cruise experiences for travelers worldwide." />
      </Helmet>
      
      <Navbar forceScrolled={true} />
      
      <div className="careers-hero py-5 bg-primary text-white text-center">
        <Container>
          <h1 className="display-4 mb-3">Join Our Team</h1>
          <p className="lead">Help us create unforgettable cruise experiences for travelers worldwide</p>
        </Container>
      </div>
      
      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="mb-4">Why Work With Us?</h2>
            <p>
              At JETSETTERS, we're passionate about creating extraordinary cruise experiences for our customers.
              When you join our team, you become part of a company that values innovation, exceptional service, and work-life balance.
            </p>
            <ListGroup variant="flush" className="mb-4">
              <ListGroup.Item className="border-0 ps-0">
                <i className="fas fa-globe-americas me-2 text-primary"></i> Travel benefits and discounts
              </ListGroup.Item>
              <ListGroup.Item className="border-0 ps-0">
                <i className="fas fa-hand-holding-heart me-2 text-primary"></i> Comprehensive health benefits
              </ListGroup.Item>
              <ListGroup.Item className="border-0 ps-0">
                <i className="fas fa-laptop-house me-2 text-primary"></i> Flexible work arrangements
              </ListGroup.Item>
              <ListGroup.Item className="border-0 ps-0">
                <i className="fas fa-award me-2 text-primary"></i> Professional development opportunities
              </ListGroup.Item>
              <ListGroup.Item className="border-0 ps-0">
                <i className="fas fa-users me-2 text-primary"></i> Collaborative and inclusive work environment
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col lg={6}>
            <img 
              src="/images/team.jpg" 
              alt="JETSETTERS Team" 
              className="img-fluid rounded shadow-sm"
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
          </Col>
        </Row>
        
        <h2 className="mb-4 text-center">Current Openings</h2>
        
        <Row>
          {jobOpenings.map(job => (
            <Col md={6} className="mb-4" key={job.id}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="mb-0">{job.title}</Card.Title>
                    <Badge bg="primary" pill>{job.type}</Badge>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">
                    <span>{job.department}</span> • <span>{job.location}</span>
                  </Card.Subtitle>
                  <Card.Text>{job.description}</Card.Text>
                  <h6>Requirements:</h6>
                  <ul className="small">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button variant="outline-primary" className="w-100">Apply Now</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-5 py-4 bg-light rounded">
          <h3>Don't see the right fit?</h3>
          <p>We're always looking for talented individuals to join our team.</p>
          <Button variant="primary">Submit Your Resume</Button>
        </div>
      </Container>
      
      <Footer />
    </>
  );
};

export default withPageElements(Careers); 