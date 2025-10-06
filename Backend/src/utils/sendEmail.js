import nodemailer from 'nodemailer';
import { asyncHandler } from './async.handeller.js';
import config from '../config/config.js'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:config.EmailUser,
        pass:config.EmailPass,
    },
});

export const sendEmail = asyncHandler(async (to,subject,html) => {
    const mailOptions = {
        from:`'skill Hub Team Limited'<${config.EmailUser}>`,
        to,
        subject,
        html
    };
    await transporter.sendEMail(mailOptions);
    console.log(`email send successfully to ${to}`)
})