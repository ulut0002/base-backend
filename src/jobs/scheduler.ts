import cron from "node-cron";
import logger from "../lib/logger";

// -------------------------
// Background Job Scheduler
// -------------------------
//
// Define all recurring tasks here using node-cron.
// This file is imported once in your entry point (index.ts),
// and all jobs are automatically scheduled.
//
// Cron format: minute hour day month day-of-week
// For reference: https://crontab.guru
//

// Daily job at midnight
cron.schedule("0 0 * * *", () => {
  logger.info("[CRON] Running daily maintenance task");
  // yourTaskService.cleanUpDailyData();
});

// Every 5 minutes
cron.schedule("*/5 * * * *", () => {
  logger.info("[CRON] Running task every 5 minutes");
  // yourTaskService.checkPendingJobs();
});

// Every Monday at 8:00 AM
cron.schedule("0 8 * * 1", () => {
  logger.info("[CRON] Running weekly report job (Monday 8am)");
  // yourTaskService.generateWeeklyReport();
});

// Add more jobs here...
