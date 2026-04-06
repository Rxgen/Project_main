import QuarterlyResultsClient from "./QuarterlyResultsClient";
import {
  getReportFiling,
  mapReportFilingData,
  transformQuarterlyResultsForComponent,
} from "@/lib/strapi-reports";

export const dynamic = "force-dynamic";

export default async function QuarterlyResultsPage() {
  let tabs = [];
  let tabsData = {};
  let error = null;

  try {
    const rawData = await getReportFiling();
    if (rawData) {
      const reportFilingData = mapReportFilingData(rawData);
      const quarterlyData =
        transformQuarterlyResultsForComponent(reportFilingData);
      tabs = quarterlyData?.tabs || [];
      tabsData = quarterlyData?.tabsData || {};
    } else {
      error = "No data received from Strapi API";
    }
  } catch (err) {
    error =
      err?.message || "Failed to fetch reports and filings data from Strapi";
    console.error("Quarterly results page — Strapi error:", err);
  }

  return (
    <QuarterlyResultsClient tabs={tabs} tabsData={tabsData} error={error} />
  );
}
