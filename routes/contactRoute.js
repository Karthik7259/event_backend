import express from 'express';
import { sendContactMail } from '../service/contactMail.js';

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { firstName, lastName, phone, email, location, organisation, info } = req.body;
  if (!firstName || !lastName || !phone || !email) {
    return res.status(400).json({ error: 'First name, last name, phone, and email are required.' });
  }
  try {
    await sendContactMail({ firstName, lastName, phone, email, location, organisation, info });
    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

export default router;
