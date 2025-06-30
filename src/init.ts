// -------------------------
// Custom Application Startup Logic
// -------------------------

import { logger, setMailProfiles } from "./lib";

/**
 * Placeholder for custom startup logic such as:
 * - Seeding initial data
 * - Preloading cache
 * - Validating system state
 */
async function initializeBusinessLogic() {
  logger.info("Running custom app initialization logic...");
  // Example: await seedDatabase(); or check system health

  // Setting up emails
  setMailProfiles({
    noReply: { name: "Company No-Reply", address: "no-reply@company.com" },
    support: { name: "Company Support", address: "support@company.com" },
    help: { name: "Company Help", address: "help@company.com" },
    marketing: { name: "Company Marketing", address: "marketing@company.com" },
    billing: { name: "Company Billing", address: "billing@company.com" },
  });
  logger.info("Mail profiles initialized");
}
