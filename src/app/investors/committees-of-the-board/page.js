import InnerBanner from '@/components/InnerBanner';
import CommitteesBoard from '@/components/CommitteesBoard';
import { generateSEOMetadataFromStrapi } from '@/lib/seo-utils';
import { getCommittee, getLeaders, getCommitteeGroups, mapCommitteesData } from '@/lib/strapi-reports';
import { mapTopBannerData } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

// Generate metadata for the committees page from Strapi
export async function generateMetadata() {
  return await generateSEOMetadataFromStrapi(
    'committee',
    'https://www.lupin.com/investors/committees-of-the-board'
  );
}

export default async function CommitteesPage() {
  let committeesData = null;
  let bannerData = null;
  let error = null;
  
  try {
    // Fetch banner from /api/committee (optional - don't fail if this fails)
    let committeeRawData = null;
    try {
      committeeRawData = await getCommittee();
    } catch (committeeErr) {
      console.warn('Failed to fetch committee banner data:', committeeErr.message);
      // Continue without banner - not critical
    }
    
    // Fetch committee-groups from /api/committee-groups (for PDF and DisplayOrder)
    let committeeGroupsRawData = null;
    try {
      committeeGroupsRawData = await getCommitteeGroups();
    } catch (groupsErr) {
      console.warn('Failed to fetch committee-groups data:', groupsErr.message);
      // Continue without committee-groups data - not critical
    }
    
    // Fetch leaders from /api/leaders (required for committees)
    let leadersRawData = null;
    try {
      leadersRawData = await getLeaders();
    } catch (leadersErr) {
      console.error('Failed to fetch leaders data:', leadersErr.message);
      error = `Failed to fetch leaders data: ${leadersErr.message}`;
      // Continue to show fallback data
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Committees - Raw API data received:', {
        hasCommitteeData: !!committeeRawData,
        hasLeadersData: !!leadersRawData,
        isLeadersArray: Array.isArray(leadersRawData?.data),
        leadersCount: Array.isArray(leadersRawData?.data) ? leadersRawData.data.length : 0,
        hasTopBanner: !!(committeeRawData?.data?.TopBanner || committeeRawData?.TopBanner),
        leadersRawDataStructure: leadersRawData ? Object.keys(leadersRawData) : null
      });
    }
    
    if (leadersRawData) {
      try {
        // Map leaders data and group by LeadershipType, merge with committee-groups data
        committeesData = mapCommitteesData(leadersRawData, committeeGroupsRawData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Committees - Mapped data:', {
            committeesCount: committeesData?.committees?.length || 0,
            committees: committeesData?.committees?.map(c => ({
              title: c.title,
              membersCount: c.members.length
            })),
            hasCommittees: !!(committeesData?.committees && committeesData.committees.length > 0)
          });
        }
        
        // Check if mapping resulted in empty committees
        if (!committeesData?.committees || committeesData.committees.length === 0) {
          error = 'No committee members found. Please ensure leaders have committee memberships assigned.';
          console.warn('Committees - Mapped data resulted in empty committees array');
        }
      } catch (mappingErr) {
        console.error('Error mapping committees data:', mappingErr);
        error = `Error processing committees data: ${mappingErr.message}`;
        committeesData = null;
      }
    } else {
      if (!error) {
        error = 'No leaders data received from Strapi API. The /api/leaders endpoint may be unavailable.';
      }
      console.error('Committees - Leaders API returned empty or null response');
    }
    
    // Map banner data from committee API (optional)
    if (committeeRawData) {
      try {
        const topBanner = committeeRawData?.data?.TopBanner || committeeRawData?.TopBanner;
        bannerData = mapTopBannerData(topBanner);
      } catch (bannerErr) {
        console.warn('Failed to map banner data:', bannerErr.message);
        // Continue without banner
      }
    }
  } catch (err) {
    // Catch any unexpected errors
    error = err.message || 'Failed to fetch committees data from Strapi';
    console.error('Unexpected error in Committees page:', err);
    console.error('Error details:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    
    // Don't set committeesData to null on error - let component use fallback
    committeesData = null;
  }

  return (
    <div style={{ position: 'relative' }}>
      {bannerData && <InnerBanner data={bannerData} />}
      <CommitteesBoard data={committeesData} error={error} />
    </div>
  );
}

