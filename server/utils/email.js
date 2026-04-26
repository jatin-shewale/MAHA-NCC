import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: env.emailSecure,
      auth: env.emailUser && env.emailPass ? { user: env.emailUser, pass: env.emailPass } : undefined
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!env.emailHost || !env.emailFrom) {
    return { skipped: true };
  }

  return getTransporter().sendMail({
    from: env.emailFrom,
    to,
    subject,
    html,
    text
  });
};
