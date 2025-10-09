import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { asyncHandler } from "../utils/async.handeller.js";
import { ApiError } from "../utils/api.handeller.js";
import config from "../config/config.js";

// Configure AWS SES Client
const sesClient = new SESClient({
    region: config.AwsRegion,
    credentials: {
        accessKeyId: config.AwsAccessKeyId,
        secretAccessKey: config.AwsSecretAccessKey,
    },
});

const sendEmail = asyncHandler(async ({ to, subject, html, text }) => {
    if (!to || !subject || (!html && !text)) {
        throw new ApiError(400, "Email, subject, and content are required");
    }

    const emailParams = {
        Source: config.AwsSesVerifiedEmail, // Must be verified in SES
        Destination: { ToAddresses: [to] },
        Message: {
            Subject: { Data: subject },
            Body: {},
        },
    };

    if (html) emailParams.Message.Body.Html = { Data: html };
    if (text) emailParams.Message.Body.Text = { Data: text };

    try {
        const result = await sesClient.send(new SendEmailCommand(emailParams));
        return result; // Return AWS response (MessageId etc.)
    } catch (error) {
        console.error("SES Email Error:", error);
        throw new ApiError(500, "Failed to send email via AWS SES");
    }
});

export { sendEmail };