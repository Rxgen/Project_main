import InnerBanner from '@/components/InnerBanner';
import LeaderProfile from '@/components/global/LeaderProfile';
import SquareLeaderProfile from '@/components/global/SquareLeaderProfile';
import MediaContact from '@/components/global/MediaContact';
import LeadershipClient from './LeadershipClient';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { mapTopBannerData } from '@/lib/strapi';
import { getLeaders, getLeadership, mapLeadersData } from '@/lib/strapi-reports';
import '@/scss/pages/leaders.scss';

export const dynamic = 'force-dynamic';

// Generate metadata for the Leaders page
export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Leaders - Lupin | Our Leadership Team",
    description: "Meet the leadership team at Lupin, driving innovation and excellence in the pharmaceutical industry.",
    canonicalUrl: "https://www.lupin.com/about-us/leadership",
    keywords: "Lupin leaders, leadership team, executives, management, Lupin Limited, pharmaceutical leadership",
  });
}

export default async function LeadersPage() {
  // Fetch data from Strapi
  let bannerData = null;
  let mappedLeadersData = null;

  try {
    // Fetch banner from leadership endpoint
    const leadershipData = await getLeadership();
    const leadershipDataObj = leadershipData?.data || leadershipData;
    if (leadershipDataObj?.TopBanner) {
      bannerData = mapTopBannerData(leadershipDataObj.TopBanner);
    }

    // Fetch leaders data
    const leadersStrapiData = await getLeaders();
    
    // Map leaders data (separates into boardOfDirectors and managementTeam)
    mappedLeadersData = mapLeadersData(leadersStrapiData);
  } catch (error) {
    console.error('Error fetching leaders data from Strapi:', error);
  }

  // Use mapped leaders data from Strapi - no fallbacks
  const boardOfDirectors = mappedLeadersData?.boardOfDirectors || [];
  const managementTeam = mappedLeadersData?.managementTeam || [];

  return (
    <LeadershipClient>
      <div style={{ position: 'relative' }}>
        {bannerData && <InnerBanner data={bannerData} />}
        {boardOfDirectors.length > 0 && (
          <section className="board-of-directors">
            <div className="board-of-directors__container">
              <h2 className="board-of-directors__heading">Board of Directors</h2>
              <div className="board-of-directors__grid">
                {boardOfDirectors
                  .filter((leader) => leader.image && leader.image.url)
                  .map((leader) => (
                    <LeaderProfile
                      key={leader.id || leader.name}
                      id={leader.id}
                      name={leader.name}
                      title={leader.title || leader.position}
                      image={leader.image}
                      link={leader.link || (leader.slug ? `/about-us/leadership/${leader.slug}` : '#')}
                    />
                  ))}
              </div>
            </div>
          </section>
        )}

        {managementTeam.length > 0 && (
          <section className="board-of-directors management-team">
            <div className="board-of-directors__container">
              <h2 className="board-of-directors__heading">The Management Team</h2>
              <div className="board-of-directors__grid">
                {managementTeam
                  .filter((leader) => leader.image && leader.image.url)
                  .map((leader) => (
                    <SquareLeaderProfile
                      key={leader.id || leader.name}
                      id={leader.id}
                      name={leader.name}
                      title={leader.title || leader.position}
                      image={leader.image}
                      link={leader.link || (leader.slug ? `/about-us/leadership/${leader.slug}` : '#')}
                    />
                  ))}
              </div>
            </div>
          </section>
        )}

        <MediaContact
          contacts={[
            {
              name: "Amit Kumar Gupta",
              title: "Company Secretary",
              email: "akgupta@lupin.com"
            },
            {
              name: "Rajalakshmi Azariah",
              title: "Vice President and Global Head – Corporate Communications",
              email: "rajalakshmiazariah@lupin.com"
            }
          ]}
          heading="Key Contacts"
        />
      </div>
    </LeadershipClient>
  );
}



