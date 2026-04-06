import InnerBanner from '@/components/InnerBanner';
import EGM from '@/components/EGM';
import DeclarationOfResultsEvoting from '@/components/DeclarationOfResultsEvoting';
import VotingResults from '@/components/VotingResults';
import VotingTable from '@/components/VotingTable';
import IEPFTable from '@/components/IEPFTable';
import NoticeSection from '@/components/NoticeSection';
import SmallCard from '@/components/global/SmallCard';
import SubscriberUpdated from '@/components/SubscriberUpdated';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getOtherStatutoryInformation, mapOtherStatutoryInformationData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';
import '@/scss/pages/financials.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Other Statutory Information page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'other-statutory-information',
    'https://www.lupin.com/investors/other-statutory-information'
  );
}

export default async function OtherStatutoryInformationPage() {
  let statutoryData = null;
  let bannerData = null;
  let error = null;
  
  try {
    const rawData = await getOtherStatutoryInformation();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Other Statutory Information - Raw API data received:', {
        hasData: !!rawData,
        isDataObject: !Array.isArray(rawData?.data) && !!rawData?.data,
        hasTopBanner: !!(rawData?.data?.TopBanner || rawData?.TopBanner),
        hasExtraordinaryGeneralMeetingSection: !!(rawData?.data?.ExtraordinaryGeneralMeetingSection || rawData?.ExtraordinaryGeneralMeetingSection),
        hasEvotingSection: !!(rawData?.data?.EvotingSection || rawData?.EvotingSection),
        hasDivendInfo: !!(rawData?.data?.DivendInfo || rawData?.DivendInfo),
        hasNoticeSection: !!(rawData?.data?.NoticeSection || rawData?.NoticeSection),
        hasPdfSection: !!(rawData?.data?.PdfSection || rawData?.PdfSection),
        hasKycUpdateSection: !!(rawData?.data?.KycUpdateSection || rawData?.KycUpdateSection)
      });
    }
    
    if (rawData) {
      statutoryData = mapOtherStatutoryInformationData(rawData);
      
      // Map banner data (Single Type, so TopBanner is directly on data object)
      const topBanner = rawData?.data?.TopBanner || rawData?.TopBanner;
      bannerData = mapTopBannerData(topBanner);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Other Statutory Information - Mapped data:', {
          hasEgmSection: !!statutoryData?.egmSection,
          hasEvotingSection: !!statutoryData?.evotingSection,
          hasDividendInfo: !!statutoryData?.dividendInfo,
          hasNoticeSection: !!statutoryData?.noticeSection,
          hasPdfSection: !!statutoryData?.pdfSection,
          hasKycSection: !!statutoryData?.kycSection,
          hasBanner: !!bannerData
        });
      }
    } else {
      error = 'No data received from Strapi API';
      console.error('Other Statutory Information - API returned empty response');
    }
  } catch (err) {
    error = err.message || 'Failed to fetch other statutory information data from Strapi';
    console.error('Error fetching Other Statutory Information data from Strapi:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Prepare data for components
  const egmData = statutoryData?.egmSection ? {
    title: statutoryData.egmSection.title,
    cards: statutoryData.egmSection.cards,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorative: "/assets/egm/decorative.svg"
    }
  } : null;

  const declarationData = statutoryData?.evotingSection ? {
    title: statutoryData.evotingSection.title,
    cards: statutoryData.evotingSection.cards,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      }
    }
  } : null;

  const votingData = statutoryData?.evotingSection ? {
    paragraph: statutoryData.evotingSection.heading,
    card: statutoryData.evotingSection.pdfCard ? {
      id: 1,
      title: statutoryData.evotingSection.pdfCard.title,
      pdfUrl: statutoryData.evotingSection.pdfCard.pdfUrl,
      isActive: statutoryData.evotingSection.pdfCard.isActive
    } : null,
    images: {
      downloadButton: {
        active: "/assets/policies/download-button-active.svg",
        inactive: "/assets/policies/download-button-inactive.svg"
      },
      decorative: "/assets/egm/decorative.svg"
    }
  } : null;

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      {egmData && <EGM data={egmData} />}
      {declarationData && <DeclarationOfResultsEvoting data={declarationData} />}
      {votingData && <VotingResults data={votingData} />}
      
      {/* Dividend Info Section */}
      {statutoryData?.dividendInfo && statutoryData.dividendInfo.map((dividendItem, index) => (
        <div key={dividendItem.id || index}>
          {dividendItem.introText && (
            <section className="policies tablePolicies">
              <div className="policies__container">
                <div className="policies__content policies__content--no-top-margin">
                  <div 
                    className="policies__table-paragraph"
                    dangerouslySetInnerHTML={{ __html: dividendItem.introText }}
                  />
                </div>
              </div>
            </section>
          )}
          {dividendItem.dividendHistory && (
            <section className="policies tablePolicies">
              <div className="policies__container">
                <div className="policies__content policies__content--no-top-margin">
                  <div 
                    className="policies__dividend-history"
                    dangerouslySetInnerHTML={{ __html: dividendItem.dividendHistory }}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      ))}

      {/* Voting Table - Always use backup/static data */}
      <VotingTable />

      {/* IEPF Table - Always use backup/static data */}
      <IEPFTable />

      {/* Notice Section */}
      <NoticeSection data={statutoryData?.noticeSection || null} />

     

      {/* Statutory Documents Section (PdfSection) */}
      {statutoryData?.pdfSection && Array.isArray(statutoryData.pdfSection) && statutoryData.pdfSection.length > 0 && (
        <section className="statutory-documents">
          <div className="statutory-documents__container">
            <div className="statutory-documents__grid">
              {statutoryData.pdfSection.map((card) => (
                <SmallCard
                  key={card.id}
                  title={card.title}
                  pdfUrl={card.pdfUrl}
                  isActive={card.isActive}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KYC Section */}
      {statutoryData?.kycSection && statutoryData.kycSection.length > 0 && (
        <>
          {statutoryData.kycSection.map((kycItem, index) => (
            <section key={kycItem.id || index} className="kyc-section">
              <div className="kyc-section__container">
                {kycItem.title && (
                  <h2 className="kyc-section__title" dangerouslySetInnerHTML={{ __html: kycItem.title }} />
                )}
                <div className="kyc-section__grid">
                  {kycItem.cards && kycItem.cards.map((card) => (
                    <SmallCard
                      key={card.id}
                      title={card.title}
                      pdfUrl={card.pdfUrl}
                      isActive={card.isActive}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </>
      )}
      
      <SubscriberUpdated />
    </div>
  );
}

