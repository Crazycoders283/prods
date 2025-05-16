import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Container fluid className="p-0">
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          {/* Add other routes here */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 