import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { google } from "googleapis";

// Credit: https://rupali.hashnode.dev/send-emails-in-nodejs-using-nodemailer-gmail-oauth2

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.MAIL_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error("*ERR: ", err);
          reject(err);
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USER,
        accessToken,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
      },
    });
    return transporter;
  } catch (err) {
    console.error("Failed to create transporter:", err);
    throw err;
  }
};

export const sendEmail = async (sender, recipients, subject, message) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: sender,
      to: recipients,
      subject: subject,
      text: message,
    });
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
