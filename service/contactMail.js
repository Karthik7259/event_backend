import nodemailer from 'nodemailer';

async function sendContactMail({ firstName, lastName, phone, email, location, organisation, info }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER || 'sales@gift4corp.com',
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: 'sales@gift4corp.com',
    subject: `Merchandise Brand Shop Inquiry from ${firstName} ${lastName}`,
    text:
      `First Name: ${firstName}\n` +
      `Last Name: ${lastName}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Location: ${location || ''}\n` +
      `Organisation: ${organisation || ''}\n` +
      `Other Information: ${info || ''}`,
  };

  return transporter.sendMail(mailOptions);
}

export { sendContactMail };