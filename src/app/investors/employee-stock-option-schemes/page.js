import InnerBanner from '@/components/InnerBanner';
import EmployeeStockOptionSchemes from '@/components/EmployeeStockOptionSchemes';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getEmployeeStockOptionScheme, mapEmployeeStockOptionSchemeData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the employee stock option schemes page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'employee-stock-option-scheme',
    'https://www.lupin.com/investors/employee-stock-option-schemes'
  );
}

export default async function EmployeeStockOptionSchemesPage() {
  let schemesData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getEmployeeStockOptionScheme();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Employee Stock Option Schemes - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasEmployeeStockOptionSchemesSection: !!(rawData?.data?.EmployeeStockOptionSchemesSection || rawData?.EmployeeStockOptionSchemesSection),
        schemesCount: (rawData?.data?.EmployeeStockOptionSchemesSection || rawData?.EmployeeStockOptionSchemesSection || []).length
      });
    }
    
    if (rawData) {
      schemesData = mapEmployeeStockOptionSchemeData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Employee Stock Option Schemes - Mapped data:', {
          schemesCount: schemesData?.schemes?.length || 0,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Employee Stock Option Schemes - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch employee stock option schemes data from Strapi';
    console.error('Error fetching Employee Stock Option Schemes data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <EmployeeStockOptionSchemes data={schemesData} error={error} />
    </div>
  );
}

