import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Container, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mailActions } from '../store/mailSlice'; // make sure the path is correct

const Inbox = () => {
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mails, unreadCount } = useSelector(state => state.mail);
  const encodedEmail = userEmail?.replace(/[.@]/g, '');
  console.log("User email in Inbox fetch:", userEmail);
  console.log("Encoded email in Inbox fetch:", encodedEmail);
  const intervalRef=useRef();

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
        console.log("Raw Response:", response)

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        const loadedMails = [];

        for (let key in data) {
          loadedMails.push({
            id: key,
            from: data[key].from,
            subject: data[key].subject,
            body: data[key].body,
            timestamp: data[key].timestamp,
            read: data[key].read || false, // default to false if not present
          });
        }
        const currentIds = mails.map((m) => m.id).sort().join(',');
        const newIds = loadedMails.map((m) => m.id).sort().join(',');
        if(currentIds!==newIds){
        dispatch(mailActions.setMails(loadedMails.reverse()));
        }
      } catch (err) {
        console.error('Error fetching inbox:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
    intervalRef.current=setInterval(fetchMails,2000);
    return clearInterval(intervalRef.current);
  }, [encodedEmail, token, dispatch,mails]);

  const openComposeHandler = () => {
    navigate('/compose');
  };

  // ✅ This is the new handler for opening mail and marking it as read
  const openMailHandler = async (mailId) => {
    dispatch(mailActions.markAsRead(mailId)); // update Redux immediately

    const mail = mails.find(m => m.id === mailId);
    const receiverPath = userEmail?.replace(/[.@]/g, '');

    // ✅ Update read status in Firebase
    await fetch(
      `https://mailbox-9747c-default-rtdb.firebaseio.com/inbox/${receiverPath}/${mailId}.json?auth=${token}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ read: true }),
      }
    );

    alert(`Full Mail:\n\nSubject: ${mail.subject}\n\n${mail.body}`);
  };

  const deleteMailHandler = async (mailId) => {
  const receiverPath = userEmail?.replace(/[.@]/g, '');

  try {
    const response = await fetch(
      `https://mailbox-9747c-default-rtdb.firebaseio.com/inbox/${receiverPath}/${mailId}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    dispatch(mailActions.deleteMail(mailId)); // ✅ Remove from Redux
  } catch (err) {
    console.error('Delete error:', err.message);
  }
};


  return (
    <Container className="mt-5">
      <Card className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Inbox ({unreadCount} unread)</h2>
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
              <ListGroup.Item key={mail.id} onClick={() => openMailHandler(mail.id)} style={{ cursor: 'pointer' }} className="d-flex justify-content-between align-items-start">
                <div>
                {!mail.read && <span style={{ color: 'blue', fontSize: '1.2rem' }}>● </span>}
                <strong>From:</strong> {mail.from} <br />
                <strong>Subject:</strong> {mail.subject}
                </div>
                <Button
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                e.stopPropagation(); // 🛑 prevent triggering openMailHandler
                deleteMailHandler(mail.id);
                }}
                >
                🗑️
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
