const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { name, subject, email, from, message, replyto } = req.body;
    
    // Validate
    if (!name || !subject || !email || !from || !message) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }
    
    // SMTP config
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'fatemaislam3380@gmail.com',
        pass: 'djrq ncxb cimp eqxo'
      }
    });
    
    // Email content
    const mailOptions = {
      from: `"${name}" <${from}>`,
      to: email,
      subject: subject,
      replyTo: replyto || from,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #006a4e, #f42a41); color: white; padding: 20px; text-align: center;">
            <h2>QuickMail</h2>
            <p>Made by Hossain | Made in Bangladesh 🇧🇩</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3>Message from: ${name}</h3>
            <p><strong>Email:</strong> ${from}</p>
            <hr>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="background: #f0f0f0; padding: 10px; text-align: center; font-size: 12px;">
            Sent via QuickMail
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ 
      success: true, 
      message: `✅ Email sent successfully to ${email}` 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email. Check SMTP settings.' 
    });
  }
}
