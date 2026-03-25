import resend from "../config/resend.config.js";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "SkillHub <noreply@myskillhub.in>", // 🔥 IMPORTANT
      to,
      subject,
      html,
    });

    console.log("Email sent:", data);
    return true;
  } catch (error) {
    console.error("Email failed:", error);
    return false;
  }
};

export { sendEmail };