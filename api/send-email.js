import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, company } = req.body;

  // Honeypot check
if (company && company.length > 0) {
  console.log("Bot detected — honeypot triggered");
  return res.status(200).json({ success: true });
}

  try {
    console.log("Sending business email...");

    // 1) Email to your business inbox
    await resend.emails.send({
      from: "Sanitize Cali <no-reply@sanitizecali.com>",
      to: "info@sanitizecali.com",
      replyTo: email,
      subject: "New Cleaning Quote Request",
      text: `New quote request from ${name} (${email}): ${message}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    console.log("Sending confirmation email...");

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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({ success: false, error });
  }
}