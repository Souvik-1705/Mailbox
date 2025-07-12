import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Welcome = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-5" style={{ width: '400px', textAlign: 'center' }}>
        <h2>Welcome to your mail box</h2>
      </Card>
    </Container>
  );
};

export default Welcome;