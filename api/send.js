const nodemailer = require('nodemailer');

export default async function handler(req, res) {
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
  
  try {
    const { name, subject, email, from, message, replyto } = req.body;
    
    if (!name || !subject || !email || !from || !message) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fatemaislam3380@gmail.com',
        pass: 'djrq ncxb cimp eqxo'
      }
    });
    
    const mailOptions = {
      from: `"${name}" <${from}>`,
      to: email,
      subject: subject,
      replyTo: replyto || from,
      html: `
        <div style="font-family: Arial; max-width: 600px;">
          <div style="background: #006a4e; color: white; padding: 20px; text-align: center;">
            <h2>QuickMail</h2>
            <p>Made by Hossain | Bangladesh 🇧🇩</p>
          </div>
          <div style="padding: 20px;">
            <h3>From: ${name}</h3>
            <p>Email: ${from}</p>
            <hr>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true, 
      message: `✅ Email sent to ${email}` 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to send email' 
    });
  }
}
