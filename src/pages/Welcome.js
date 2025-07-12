import React from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const goToInbox = () => {
    navigate('/inbox');
  };

  const goToSent = () => {
    navigate('/sent');
  };

  const goToCompose = () => {
    navigate('/compose');
  };

  const userEmail = localStorage.getItem('email');

  return (
    <Container className="mt-5">
      <Card className="p-4 text-center">
        <h2>Welcome to Your Mailbox</h2>
        <p className="mb-4">Logged in as: <strong>{userEmail}</strong></p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button variant="primary" onClick={goToInbox}>Inbox</Button>
          <Button variant="secondary" onClick={goToSent}>Sent</Button>
          <Button variant="success" onClick={goToCompose}>Compose</Button>
          <Button variant="danger" onClick={logoutHandler}>Logout</Button>
        </div>
      </Card>
    </Container>
  );
};

export default Welcome;
