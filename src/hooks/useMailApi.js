import { useCallback } from 'react';

const FIREBASE_BASE = 'https://mailbox-9747c-default-rtdb.firebaseio.com';

const useMailApi = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const encodedEmail = email?.replace(/[.@]/g, '');

  // 🔹 Get inbox mails
  const fetchInbox = useCallback(async () => {
    const response = await fetch(`${FIREBASE_BASE}/inbox/${encodedEmail}.json?auth=${token}`);
    if (!response.ok) throw new Error('Failed to fetch inbox');
    const data = await response.json();
    const loaded = [];
    for (let key in data) {
      loaded.push({ id: key, ...data[key], read: data[key].read || false });
    }
    return loaded.reverse();
  }, [encodedEmail, token]);

  // 🔹 Send a mail (to inbox and sent)
  const sendMail = useCallback(async (to, mailData) => {
    const receiverPath = to.replace(/[.@]/g, '');
    const senderPath = encodedEmail;

    const inboxResp = await fetch(`${FIREBASE_BASE}/inbox/${receiverPath}.json?auth=${token}`, {
      method: 'POST',
      body: JSON.stringify(mailData),
    });

    const sentResp = await fetch(`${FIREBASE_BASE}/sent/${senderPath}.json?auth=${token}`, {
      method: 'POST',
      body: JSON.stringify(mailData),
    });

    if (!inboxResp.ok || !sentResp.ok) throw new Error('Failed to send mail');
  }, [encodedEmail, token]);

  // 🔹 Delete mail
  const deleteMail = useCallback(async (mailId, box = 'inbox') => {
    const response = await fetch(
      `${FIREBASE_BASE}/${box}/${encodedEmail}/${mailId}.json?auth=${token}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Failed to delete mail');
  }, [encodedEmail, token]);

  // 🔹 Mark as read
  const markMailAsRead = useCallback(async (mailId) => {
    const response = await fetch(
      `${FIREBASE_BASE}/inbox/${encodedEmail}/${mailId}.json?auth=${token}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ read: true }),
      }
    );
    if (!response.ok) throw new Error('Failed to update read status');
  }, [encodedEmail, token]);

  // 🔹 Fetch sent mails
  const fetchSent = useCallback(async () => {
    const response = await fetch(`${FIREBASE_BASE}/sent/${encodedEmail}.json?auth=${token}`);
    if (!response.ok) throw new Error('Failed to fetch sent mails');
    const data = await response.json();
    const loaded = [];
    for (let key in data) {
      loaded.push({ id: key, ...data[key] });
    }
    return loaded.reverse();
  }, [encodedEmail, token]);

  return { fetchInbox, sendMail, deleteMail, markMailAsRead, fetchSent };
};

export default useMailApi;
