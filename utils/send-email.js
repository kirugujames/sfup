import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

//method to send email
export async function sendEmail(req) {
  if (!req.to || !req.subject || !req.message) {
    return {
      success: false,
      message: "to, subject, and message are required",
      status: 400,
    };
  }

  try {
    // Create a transporter using SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_PORT == '465' || true, // use SSL if port is 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: req.to,
      subject: req.subject,
      text: req.message,
      html: `<p>${req.message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      status: 200,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
}