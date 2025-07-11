import { storage } from "../storage";
import { analyticsEvents, analyticsDaily, reports, AnalyticsEvent, AnalyticsDaily, InsertAnalyticsEvent, InsertAnalyticsDaily, Report } from "@shared/schema";
import { db } from "../db";
import { eq, and, sql, isNull } from "drizzle-orm";

// Track user activity by logging analytics events
export async function trackEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
  return await storage.recordAnalyticsEvent(event);
}

// Helper function to track page views
export async function trackPageView(userId: number | null, path: string, properties: Record<string, any> = {}): Promise<AnalyticsEvent> {
  return await trackEvent({
    userId,
    eventType: 'page_view',
    eventSource: 'web',
    properties: {
      path,
      ...properties
    }
  });
}

// Helper function to track button clicks and other UI interactions
export async function trackInteraction(userId: number | null, interactionType: string, properties: Record<string, any> = {}): Promise<AnalyticsEvent> {
  return await trackEvent({
    userId,
    eventType: 'interaction',
    eventSource: 'web',
    properties: {
      interactionType,
      ...properties
    }
  });
}

// Helper function to track service usage events
export async function trackServiceUsage(userId: number, serviceType: string, properties: Record<string, any> = {}): Promise<AnalyticsEvent> {
  return await trackEvent({
    userId,
    eventType: 'service_usage',
    eventSource: 'web',
    properties: {
      serviceType,
      ...properties
    }
  });
}

// Aggregate daily metrics from events
export async function aggregateDailyMetrics(date: Date = new Date()): Promise<{ [key: string]: number }> {
  const formattedDate = new Date(date);
  formattedDate.setHours(0, 0, 0, 0); // Start of the day
  
  const nextDay = new Date(formattedDate);
  nextDay.setDate(nextDay.getDate() + 1); // Start of the next day
  
  // Placeholder for aggregation results
  const results: { [key: string]: number } = {};
  
  // Get all events for the day
  // In a real implementation, we'd run aggregation queries directly in the database
  // For this example, we'll simulate some common metrics calculation

  // 1. Count active users for the day
  const activeUserEvents = await db
    .select({
      userId: analyticsEvents.userId
    })
    .from(analyticsEvents)
    .where(and(
      sql`${analyticsEvents.timestamp} >= ${formattedDate}`,
      sql`${analyticsEvents.timestamp} < ${nextDay}`,
      isNull(analyticsEvents.userId).not()
    ))
    .groupBy(analyticsEvents.userId);
  
  results.active_users = activeUserEvents.length;
  
  // 2. Count page views
  const pageViewEvents = await db
    .select({
      count: sql<number>`count(*)`
    })
    .from(analyticsEvents)
    .where(and(
      sql`${analyticsEvents.timestamp} >= ${formattedDate}`,
      sql`${analyticsEvents.timestamp} < ${nextDay}`,
      eq(analyticsEvents.eventType, 'page_view')
    ));
  
  results.page_views = pageViewEvents[0]?.count || 0;
  
  // 3. Count service usages by type
  const serviceUsageEvents = await db
    .select({
      serviceType: sql<string>`analytics_events.properties->>'serviceType'`,
      count: sql<number>`count(*)`
    })
    .from(analyticsEvents)
    .where(and(
      sql`${analyticsEvents.timestamp} >= ${formattedDate}`,
      sql`${analyticsEvents.timestamp} < ${nextDay}`,
      eq(analyticsEvents.eventType, 'service_usage')
    ))
    .groupBy(sql`analytics_events.properties->>'serviceType'`);
  
  for (const usage of serviceUsageEvents) {
    if (usage.serviceType) {
      results[`service_usage_${usage.serviceType}`] = usage.count;
    }
  }
  
  // Save the calculated metrics to the database
  for (const [metric, value] of Object.entries(results)) {
    let category = 'general';
    
    if (metric.startsWith('service_usage_')) {
      category = 'service_usage';
    }
    
    await storage.updateDailyMetric({
      date: formattedDate,
      metric,
      category,
      district: null,
      taluk: null,
      value
    });
  }
  
  return results;
}

// Generate a report based on date range and metrics
export async function generateReport(params: {
  startDate: Date,
  endDate: Date,
  metrics: string[],
  categories?: string[],
  district?: string,
  taluk?: string,
  groupBy?: 'day' | 'week' | 'month'
}): Promise<any> {
  // Get raw metrics data
  const metrics = await storage.getDailyMetrics({
    startDate: params.startDate,
    endDate: params.endDate,
    metrics: params.metrics,
    categories: params.categories,
    district: params.district,
    taluk: params.taluk
  });
  
  // For simplicity, we'll just return the raw data
  // In a real implementation, we would transform this into a more useful format
  // based on the groupBy parameter and other requirements
  return metrics;
}

// Schedule a report for regular generation
export async function scheduleReport(reportConfig: {
  name: string,
  description: string,
  createdBy: number,
  isPublic: boolean,
  config: any,
  schedule: string // Cron expression
}): Promise<Report> {
  return await storage.createReport({
    name: reportConfig.name,
    description: reportConfig.description,
    createdBy: reportConfig.createdBy,
    isPublic: reportConfig.isPublic,
    config: reportConfig.config,
    schedule: reportConfig.schedule
  });
}

// Process all scheduled reports that are due to run
export async function processScheduledReports(): Promise<void> {
  // Get all reports with schedules
  const reports = await db
    .select()
    .from(reports)
    .where(isNull(reports.schedule).not());
  
  // For each report, check if it's due to run based on its schedule
  // This would require a cron expression parser in a real implementation
  for (const report of reports) {
    // Simplified check - in reality we'd use a cron parser library
    const isDue = shouldRunReport(report);
    
    if (isDue) {
      try {
        // Run the report
        const result = await generateReport(report.config);
        
        // Update last run time
        await storage.updateReport(report.id, {
          lastRun: new Date()
        });
        
        // In a real implementation, we might:
        // 1. Store the report results
        // 2. Send the report by email
        // 3. Create a notification for the report owner
      } catch (error) {
        console.error(`Error running scheduled report ${report.id}:`, error);
      }
    }
  }
}

// Helper function to determine if a report is due to run
function shouldRunReport(report: Report): boolean {
  // For demo purposes - in reality we'd use a cron parser library
  // to check if the current time matches the schedule
  
  // If it's never been run, or it's been more than a day since last run, run it
  if (!report.lastRun) return true;
  
  const daysSinceLastRun = Math.floor(
    (Date.now() - report.lastRun.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Simplified logic - if schedule includes 'daily', run daily, etc.
  if (report.schedule.includes('daily') && daysSinceLastRun >= 1) return true;
  if (report.schedule.includes('weekly') && daysSinceLastRun >= 7) return true;
  if (report.schedule.includes('monthly') && daysSinceLastRun >= 30) return true;
  
  return false;
}