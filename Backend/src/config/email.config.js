import { Resend } from "resend";
import config from "./config.js";

const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    "RESEND_API_KEY is not set."
  );
}

const resend = new Resend(resendApiKey);

export default resend;