import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate=useNavigate();
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-5" style={{ width: '400px', textAlign: 'center' }}>
        <h2>Welcome to your mail box</h2>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/compose')}
        >Compose New Mail</Button>
      </Card>
    </Container>
  );
};

export default Welcome;