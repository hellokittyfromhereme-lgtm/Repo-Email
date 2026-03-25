const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { name, subject, email, replyto, from, message } = req.body;
  
  // Validate
  if (!name || !subject || !email || !from || !message) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }
  
  // Gmail SMTP Configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'fatemaislam3380@gmail.com',
      pass: 'djrq ncxb cimp eqxo'  // আপনার App Password
    }
  });
  
  // Email content
  const mailOptions = {
    from: `"${name}" <${from}>`,
    to: email,
    subject: subject,
    replyTo: replyto || from,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #006a4e, #f42a41); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>QuickMail</h2>
            <p>Made by Hossain | Made in Bangladesh 🇧🇩</p>
          </div>
          <div class="content">
            <h3>Message from: ${name}</h3>
            <p><strong>Email:</strong> ${from}</p>
            <hr>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="footer">
            <p>Sent via QuickMail</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: `✅ Email sent to ${email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email. Check SMTP settings.' });
  }
};