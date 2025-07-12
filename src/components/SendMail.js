
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SendMail = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const senderEmail = localStorage.getItem('email'); 

  const sendMailHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSentSuccess(false);

    if (!to || !subject || !body) {
      setError('All fields are required');
      return;
    }

    const mailData = {
      to,
      from: senderEmail,
      subject,
      body,
      timestamp: new Date().toISOString(),
    };

    
    const senderPath = senderEmail.replace('.', ',');
    const receiverPath = to.replace('.', ',');

    try {
     
      await fetch(`https://mailbox-9747c-default-rtdb.firebaseio.com/inbox/${receiverPath}.json`, {
        method: 'POST',
        body: JSON.stringify(mailData),
        headers: { 'Content-Type': 'application/json' },
      });

      
      await fetch(`https://mailbox-9747c-default-rtdb.firebaseio.com/sent/${senderPath}.json`, {
        method: 'POST',
        body: JSON.stringify(mailData),
        headers: { 'Content-Type': 'application/json' },
      });

      setSentSuccess(true);
      setTo('');
      setSubject('');
      setBody('');
    } catch (err) {
      setError('Failed to send mail. Try again later.');
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h2 className="text-center mb-4">Compose Mail</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {sentSuccess && <Alert variant="success">Mail sent successfully!</Alert>}
        <Form onSubmit={sendMailHandler}>
          <Form.Group className="mb-3">
            <Form.Label>To</Form.Label>
            <Form.Control
              type="email"
              placeholder="Recipient email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Body</Form.Label>
            <ReactQuill theme="snow" value={body} onChange={setBody} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">Send</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SendMail;
