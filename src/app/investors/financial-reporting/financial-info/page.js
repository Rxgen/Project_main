import FinancialInfoPageClient from "./FinancialInfoPageClient";
import { getFinancial, mapFinancialData } from "@/lib/strapi-reports";

export const dynamic = "force-dynamic";

export default async function FinancialInfoPage() {
  let revenueProfitabilityData = null;

  try {
    const rawData = await getFinancial();
    if (rawData) {
      const financialData = mapFinancialData(rawData);
      revenueProfitabilityData = financialData?.revenueProfitability || null;
    }
  } catch (err) {
    console.error("Error fetching Financial data for financial-info:", err);
  }

  return (
    <FinancialInfoPageClient
      revenueProfitabilityData={revenueProfitabilityData}
    />
  );
}
