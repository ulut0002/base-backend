/**
 * Options for email normalization.
 * - stripPlusAliases: removes `+alias` suffixes from the local part of emails (default: true)
 */
type NormalizeOptions = {
  stripPlusAliases?: boolean;
  normalizeDomains?: boolean;
};
export type { NormalizeOptions };
