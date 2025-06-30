/**
 * Options for email normalization.
 * - stripPlusAliases: removes `+alias` suffixes from the local part of emails (default: true)
 */
type NormalizeOptions = {
  stripPlusAliases?: boolean;
  normalizeDomains?: boolean;
};

type MailProfile = {
  name: string;
  address: string;
};

type MailProfiles = {
  [key: string]: MailProfile;
};

export type { NormalizeOptions, MailProfiles, MailProfile };
