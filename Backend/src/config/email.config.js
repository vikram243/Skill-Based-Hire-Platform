import nodemailer from "nodemailer";
import config from "./config.js";

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EmailUser,
    pass: config.EmailPass,
  },
});

export default transporter;