// src/utils/email.ts
import nodemailer, { Transporter } from "nodemailer";
import { loadConfig } from "../config";
import { assertConfigVarsExist } from "./environment.utils";

const createTransporter = (): Transporter => {
  const config = loadConfig();

  assertConfigVarsExist([
    ["NODEMAILER_HOST", config.NODEMAILER_HOST],
    ["NODEMAILER_PORT", config.NODEMAILER_PORT],
    ["NODEMAILER_USER", config.NODEMAILER_USER],
    ["NODEMAILER_PASS", config.NODEMAILER_PASS],
    ["NODEMAILER_EMAIL_FROM", config.NODEMAILER_EMAIL_FROM],
  ]);
  const transporter = nodemailer.createTransport({
    host: config.NODEMAILER_HOST,
    port: config.NODEMAILER_PORT,
    auth: {
      user: config.NODEMAILER_USER,
      pass: config.NODEMAILER_PASS,
    },
  });

  return transporter;
};

async function sendPasswordResetEmail(to: string, code: string) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@example.com",
    to,
    subject: "Your Password Reset Code",
    text: `Your password reset code is: ${code}`,
    html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
  });
}

export { sendPasswordResetEmail };
