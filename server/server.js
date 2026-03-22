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
    console.log("Sending business email...");

    // 1) Email to your business inbox
    const data = await resend.emails.send({
      from: "Sanitize Cali <no-reply@sanitizecali.com>",
      to: "info@sanitizecali.com",
      replyTo: email,
      subject: "New Cleaning Quote Request",
      text: `New quote request from ${name} (${email}): ${message}`,   // ← REQUIRED
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    console.log("Sending confirmation email to customer...");

    // 2) Confirmation email to customer
    await resend.emails.send({
      from: "Sanitize Cali <no-reply@sanitizecali.com>",
      to: email,
      replyTo: "info@sanitizecali.com",
      subject: "We received your quote request",
      text: `Thanks ${name || "there"}, we received your quote request.`,
      html: `
        <h2>Thanks for contacting Sanitize Cali!</h2>
        <p>Hi ${name || "there"},</p>
        <p>We’ve received your quote request and will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <p>Best,<br>Sanitize Cali</p>
      `,
    });

    console.log("Both emails sent!");

    res.json({ success: true, data });
  } catch (error) {
    console.error("FULL ERROR:", JSON.stringify(error, null, 2));
    res.status(500).json({ success: false, error });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));