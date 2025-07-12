import React, { useEffect, useState } from 'react';
import { Button, Card, Container, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mailActions } from '../store/mailSlice';
import useMailApi from '../hooks/useMailApi';

const Inbox = () => {
  const [loading, setLoading] = useState(true);
  const { mails, unreadCount } = useSelector(state => state.mail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchInbox, deleteMail, markMailAsRead } = useMailApi();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const mails = await fetchInbox();
        dispatch(mailActions.setMails(mails));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [dispatch, fetchInbox]);

  const openMailHandler = async (id) => {
    dispatch(mailActions.markAsRead(id));
    await markMailAsRead(id);
    const mail = mails.find(m => m.id === id);
    alert(`Subject: ${mail.subject}\n\n${mail.body}`);
  };

  const deleteHandler = async (id) => {
    await deleteMail(id, 'inbox');
    dispatch(mailActions.deleteMail(id));
  };

  const openComposeHandler = () => navigate('/compose');

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <div className="d-flex justify-content-between mb-3">
          <h2>Inbox ({unreadCount} unread)</h2>
          <Button onClick={openComposeHandler}>Compose</Button>
        </div>
        {loading ? (
          <Spinner animation="border" />
        ) : mails.length === 0 ? (
          <p>No mails received.</p>
        ) : (
          <ListGroup>
            {mails.map(mail => (
              <ListGroup.Item
                key={mail.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div onClick={() => openMailHandler(mail.id)} style={{ cursor: 'pointer' }}>
                  {!mail.read && <span style={{ color: 'blue' }}>● </span>}
                  <strong>From:</strong> {mail.from} <br />
                  <strong>Subject:</strong> {mail.subject}
                </div>
                <Button variant="danger" size="sm" onClick={() => deleteHandler(mail.id)}>
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default Inbox;
