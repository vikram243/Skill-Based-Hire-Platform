import resend from "../config/resend.config.js";

const sendEmail = async ({ to, subject, text }) => {
  try {
    const data = await resend.emails.send({
      from: "SkillHub <noreply@myskillhub.in>",
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error("Email failed:", error);
    return false;
  }
};

export { sendEmail };