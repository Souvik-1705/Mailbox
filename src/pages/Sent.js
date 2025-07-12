// src/pages/Sent.js
import React, { useEffect, useState } from 'react';
import { Card, Container, ListGroup, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { mailActions } from '../store/mailSlice';
import useMailApi from '../hooks/useMailApi';

const Sent = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { mails } = useSelector(state => state.mail);
  const { fetchSent } = useMailApi();

  useEffect(() => {
    const getMails = async () => {
      const mails = await fetchSent();
      dispatch(mailActions.setMails(mails));
      setLoading(false);
    };
    getMails();
  }, [dispatch, fetchSent]);

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h2>Sent Mails</h2>
        {loading ? (
          <Spinner animation="border" />
        ) : mails.length === 0 ? (
          <p>No sent mails.</p>
        ) : (
          <ListGroup>
            {mails.map((mail) => (
              <ListGroup.Item key={mail.id}>
                <div><strong>To:</strong> {mail.to}</div>
                <div><strong>Subject:</strong> {mail.subject}</div>
                <div dangerouslySetInnerHTML={{ __html: mail.body }} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default Sent;
