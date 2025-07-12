// src/pages/Sent.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Sent = () => {
  const [sentMails, setSentMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const encodedEmail = userEmail?.replace(/[.@]/g, '');

  useEffect(() => {
    const fetchSentMails = async () => {
      if (!token || !encodedEmail) return;

      try {
        const response = await fetch(
          `https://mailbox-9747c-default-rtdb.firebaseio.com/sent/${encodedEmail}.json?auth=${token}`
        );

        if (!response.ok) throw new Error('Failed to fetch sent mails');

        const data = await response.json();
        const loadedMails = [];

        for (let key in data) {
          loadedMails.push({
            id: key,
            to: data[key].to,
            subject: data[key].subject,
            body: data[key].body,
            timestamp: data[key].timestamp,
          });
        }

        setSentMails(loadedMails.reverse());
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSentMails();
  }, [token, encodedEmail]);

  const openComposeHandler = () => {
    navigate('/compose');
  };

  const openSentMailHandler = (mail) => {
    alert(`To: ${mail.to}\n\nSubject: ${mail.subject}\n\n${mail.body}`);
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Sent Mail</h2>
          <Button onClick={openComposeHandler}>Compose</Button>
        </div>

        {loading ? (
          <Spinner animation="border" />
        ) : sentMails.length === 0 ? (
          <p>No sent mails found.</p>
        ) : (
          <ListGroup>
            {sentMails.map(mail => (
              <ListGroup.Item key={mail.id} onClick={() => openSentMailHandler(mail)} style={{ cursor: 'pointer' }}>
                <strong>To:</strong> {mail.to} <br />
                <strong>Subject:</strong> {mail.subject}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default Sent;
