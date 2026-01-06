import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(req) {
  if (!req.to || !req.subject || !req.message) {
    return {
      success: false,
      message: "to, subject, and message are required",
      status: 400,
    };
  }

  try {
    const data = await resend.emails.send({
      from: 'Shikana Frontliners <onboarding@resend.dev>',
      to: req.to,
      subject: req.subject,
      text: req.message,
      html: `<p>${req.message}</p>`,
    });

    console.log("Email sent:", data.id);

    return {
      success: true,
      messageId: data.id,
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