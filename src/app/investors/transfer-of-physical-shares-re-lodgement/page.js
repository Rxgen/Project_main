import InnerBanner from '@/components/InnerBanner';
import TransferPhysicalShares from '@/components/TransferPhysicalShares';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getTransferPhysicalShare, mapTransferPhysicalShareData } from '@/lib/strapi-reports';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the transfer of physical shares page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'transfer-physical-share',
    'https://www.lupin.com/investors/transfer-of-physical-shares-re-lodgement'
  );
}

export default async function TransferPhysicalSharesPage() {
  let transferData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getTransferPhysicalShare();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Transfer Physical Share - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasDescription: !!(rawData?.data?.Description || rawData?.Description)
      });
    }
    
    if (rawData) {
      transferData = mapTransferPhysicalShareData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Transfer Physical Share - Raw data Description:', rawData?.data?.Description || rawData?.Description);
        console.log('Transfer Physical Share - Mapped data:', {
          hasDescription: !!transferData?.description,
          descriptionLength: transferData?.description?.length || 0,
          descriptionPreview: transferData?.description?.substring(0, 100) || 'N/A',
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Transfer Physical Share - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch transfer physical share data from Strapi';
    console.error('Error fetching Transfer Physical Share data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  return (
    <div className="transfer-physical-shares-page" style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <TransferPhysicalShares data={transferData} error={error} />
    </div>
  );
}













