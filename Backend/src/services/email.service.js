import resend from "../config/email.config.js";
import config from "../config/config.js";

const sendEmail = async ({ to, subject, text, html, from }) => {
  try {
    const message = {
      from: "onboarding@resend.dev",
      to,
      subject,
      html: html || (text ? `<pre>${text}</pre>` : ""),
    };

    const res = await resend.emails.send(message);
    console.log("Email sent:", res.id || res);
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
};

export { sendEmail };