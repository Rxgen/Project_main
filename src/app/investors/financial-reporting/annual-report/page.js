import AnnualReportClient from "./AnnualReportClient";
import {
  getReportFiling,
  mapReportFilingData,
  transformAnnualReportsForComponent,
} from "@/lib/strapi-reports";

export const dynamic = "force-dynamic";

export default async function AnnualReportPage() {
  let tabs = [];
  let tabsData = {};
  let error = null;

  try {
    const rawData = await getReportFiling();
    if (rawData) {
      const reportFilingData = mapReportFilingData(rawData);
      const annualReportData =
        transformAnnualReportsForComponent(reportFilingData);
      tabs = annualReportData?.tabs || [];
      tabsData = annualReportData?.tabsData || {};
    } else {
      error = "No data received from Strapi API";
    }
  } catch (err) {
    error =
      err?.message || "Failed to fetch reports and filings data from Strapi";
    console.error("Annual report page — Strapi error:", err);
  }

  return (
    <AnnualReportClient tabs={tabs} tabsData={tabsData} error={error} />
  );
}
