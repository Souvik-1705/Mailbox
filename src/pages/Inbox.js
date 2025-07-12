import React, { useEffect, useState } from 'react';
import { Button, Card, Container, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  const encodedEmail = userEmail?.replace(/[.@]/g, '');
  console.log(encodedEmail);

  useEffect(() => {
    const fetchMails = async () => {
      if (!token || !encodedEmail) {
        console.error('Missing token or email');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://mailbox-9747c-default-rtdb.firebaseio.com/inbox/${encodedEmail}.json?auth=${token}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const loadedMails = [];

        for (let key in data) {
          loadedMails.push({
            id: key,
            from: data[key].from,
            subject: data[key].subject,
            body: data[key].body,
            timestamp: data[key].timestamp,
          });
        }

        setMails(loadedMails.reverse());
      } catch (err) {
        console.error('Error fetching inbox:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [encodedEmail, token]);

  const openComposeHandler = () => {
    navigate('/compose');
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Inbox</h2>
          <Button variant="primary" onClick={openComposeHandler}>
            Compose
          </Button>
        </div>

        {loading ? (
          <Spinner animation="border" />
        ) : mails.length === 0 ? (
          <p>No mails received.</p>
        ) : (
          <ListGroup>
            {mails.map((mail) => (
              <ListGroup.Item key={mail.id}>
                <div><strong>From:</strong> {mail.from}</div>
                <div><strong>Subject:</strong> {mail.subject}</div>
                <div dangerouslySetInnerHTML={{ __html: mail.body }} />
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {new Date(mail.timestamp).toLocaleString()}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default Inbox;
