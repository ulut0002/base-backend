// src/utils/email.ts
import nodemailer, { Transporter } from "nodemailer";
import { loadConfig } from "../config";
import { assertConfigVarsExist } from "./environment.utils";
import { NormalizeOptions } from "../../types";

const createTransporter = (): Transporter => {
  const config = loadConfig();

  assertConfigVarsExist([
    ["NODEMAILER_HOST", config.nodemailerHost],
    ["NODEMAILER_PORT", config.nodemailerPort],
    ["NODEMAILER_USER", config.nodemailerUser],
    ["NODEMAILER_PASS", config.nodemailerPass],
    ["NODEMAILER_EMAIL_FROM", config.nodemailerEmailFrom],
  ]);
  const transporter = nodemailer.createTransport({
    host: config.nodemailerHost,
    port: config.nodemailerPort,
    auth: {
      user: config.nodemailerUser,
      pass: config.nodemailerPass,
    },
  });

  return transporter;
};

const getFromEmail = (): string => {
  const config = loadConfig();
  let fromEmail = config.nodemailerUser;
  if (config.nodemailerEmailFrom) {
    fromEmail = `${config.nodemailerEmailFrom} <${fromEmail}>`;
  }
  return fromEmail || "";
};

const sendPasswordResetEmail = async (
  to: string,
  code: string,
  linkToken: string
) => {
  const transporter = createTransporter();
  let fromEmail = getFromEmail();

  await transporter.sendMail({
    from: fromEmail || "no-reply@example.com",
    to,
    subject: "Your Password Reset Code",
    text: `Your password reset code is: ${code}`,
    html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
  });
};

/**
 * Normalize an email address according to provider-specific rules.
 *
 * This function handles:
 * - Lowercasing the email
 * - Removing dots and `+` aliases for certain providers (e.g., Gmail)
 * - Unifying domain aliases (e.g., googlemail.com → gmail.com)
 * - Optional fallback normalization for unknown domains
 * - Returns `null` if the input is not a valid email format
 */
function normalizeEmail(
  email: string,
  options?: NormalizeOptions
): string | null {
  email = email.trim().toLowerCase();

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(email)) return null;

  const [rawLocal, rawDomain] = email.split("@");
  const rule = domainRules[rawDomain] ?? {};

  const stripPlus = options?.stripPlusAliases ?? true;
  const normalizeDomains = options?.normalizeDomains ?? true;

  let local = rawLocal;

  if (rule.stripDots) {
    local = local.replace(/\./g, "");
  }

  if (stripPlus && rule.stripPlus) {
    local = local.split("+")[0];
  }

  const finalDomain =
    normalizeDomains && rule.normalizeTo ? rule.normalizeTo : rawDomain;

  return `${local}@${finalDomain}`;
}

const domainRules: Record<
  string,
  {
    stripDots?: boolean;
    stripPlus?: boolean;
    normalizeTo?: string;
  }
> = {
  "gmail.com": { stripDots: true, stripPlus: true, normalizeTo: "gmail.com" },
  "googlemail.com": {
    stripDots: true,
    stripPlus: true,
    normalizeTo: "gmail.com",
  },
  "outlook.com": { stripPlus: true },
  "hotmail.com": { stripPlus: true },
  "live.com": { stripPlus: true },
  "icloud.com": { stripPlus: true },
  "protonmail.com": { stripPlus: true },
  "proton.me": { stripPlus: true },
};

export { sendPasswordResetEmail, normalizeEmail };
