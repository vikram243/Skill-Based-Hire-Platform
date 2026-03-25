import { Resend } from "resend";
import config from "./config.js";

const resend = new Resend(config.ResendApiKey);

export default resend;