
import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    //1) Email to you (Business inbox)
    const data = await resend.emails.send({
      from: "Sanitize Cali <no-reply@sanitizecali.com>",
      to: "info@sanitizecali.com",
      replyTo: email,
      subject: "New Cleaning Quote Request",
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    // 2) Confirmation email to customer
await resend.emails.send({
  from: "Sanitize Cali <no-reply@sanitizecali.com>",
  to: email,
  subject: "We received your quote request",
  html: `
    <h2>Thanks for contacting Sanitize Cali!</h2>
    <p>Hi ${name || "there"},</p>
    <p>We’ve received your quote request and will get back to you shortly.</p>
    <p><strong>Your message:</strong></p>
    <p>${message}</p>
    <p>Best,<br>Sanitize Cali</p>
  `,
});

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));