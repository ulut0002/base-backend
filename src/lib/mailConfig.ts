// src/lib/mailConfig.ts

import { MailProfile, MailProfiles } from "../types";

let _mailProfiles: MailProfiles | null = null;

function setMailProfiles(profiles: MailProfiles) {
  _mailProfiles = profiles;
}

function getMailProfiles(): MailProfiles {
  if (!_mailProfiles) {
    throw new Error("Mail profiles not initialized");
  }
  return _mailProfiles;
}

function getMailProfile(key: string): MailProfile {
  const profiles = getMailProfiles();
  const profile = profiles[key];
  if (!profile) {
    throw new Error(`Mail profile "${key}" not found`);
  }
  return profile;
}

export { setMailProfiles, getMailProfiles, getMailProfile };
