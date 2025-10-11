import transporter from "../config/email.config.js";

const sendEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: "Skill-Hub",
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email send failed:", error.message);
    return false;
  }
};

export { sendEmail };