import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    console.log("Sending email with FROM:", "onboarding@resend.dev");

    const data = await resend.emails.send({
      from: "Sanitize Cali <onboarding@resend.dev>",
      to: "info@sanitizecali.com",
      reply_to: email,   // ← THIS FIXES YOUR EMAIL INBOX "REPLY TO" ISSUE
      subject: `New Quote Request from ${name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

console.log("DEPLOY TEST - Roman");