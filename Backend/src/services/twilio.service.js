import twilio from "twilio";
import config from "../config/config.js";

const client = twilio(config.twillioAccountSid, config.twillioToken);

export const sendSms = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: config.twillioNumber,
      to,
    });
    
    return response;
  } catch (error) {
    console.error("Twilio SMS Error:", error.message);
    throw new Error("Failed to send SMS");
  }
};
