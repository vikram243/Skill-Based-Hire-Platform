import resend from "../config/resend.config.js";

const sendEmail = async ({ to, subject, text, html, from }) => {
  try {
    const data = await resend.emails.send({
      from: "SkillHub <noreply@myskillhub.in>",
      to,
      subject,
      html: html || (text ? `<pre>${text}</pre>` : ""),
    };

    console.log("Email sent:", data);
    return true;
  } catch (error) {
    console.error("Email failed:", error);
    return false;
  }
};

export { sendEmail };