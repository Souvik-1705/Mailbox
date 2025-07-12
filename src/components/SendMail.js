import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import useMailApi from '../hooks/useMailApi';

const SendMail = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [error, setError] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const { sendMail } = useMailApi();

  const senderEmail = localStorage.getItem('email');

  const sendMailHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSentSuccess(false);

    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlBody = draftToHtml(rawContentState);

    if (!to || !subject || !htmlBody.trim()) {
      setError('All fields are required');
      return;
    }

    const mailData = {
      to,
      from: senderEmail,
      subject,
      body: htmlBody,
      timestamp: new Date().toISOString(),
      read: false
    };

    try {
      await sendMail(mailData);
      setSentSuccess(true);
      setTo('');
      setSubject('');
      setEditorState(EditorState.createEmpty());
    } catch (err) {
      setError('Failed to send mail. Please try again later.');
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
            <div style={{ border: '1px solid #ccc', padding: '2px', minHeight: '200px' }}>
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
              />
            </div>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Send
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SendMail;
