import InnerBanner from '@/components/InnerBanner';
import Image from 'next/image';
import Link from 'next/link';
import LeaderDetailClient from './LeaderDetailClient';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getLeaderBySlug, mapLeaderDetailData } from '@/lib/strapi-reports';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '@/scss/pages/leader-details.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

// Generate metadata for the leader details page
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams || {};
  
  let leaderName = 'Leader';
  let leaderTitle = '';
  
  try {
    const strapiData = await getLeaderBySlug(slug);
    const leaderData = mapLeaderDetailData(strapiData);
    if (leaderData) {
      leaderName = leaderData.name || leaderName;
      leaderTitle = leaderData.title || '';
    }
  } catch (error) {
    // Fallback to slug-based name
    leaderName = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Leader';
  }
  
  return generateSEOMetadata({
    title: `${leaderName}${leaderTitle ? ` - ${leaderTitle}` : ''} | Lupin Leadership`,
    description: `Learn about ${leaderName}${leaderTitle ? `, ${leaderTitle}` : ''}, their background, education, and role at Lupin Limited.`,
    canonicalUrl: `https://www.lupin.com/about-us/leadership/${slug || ''}`,
    keywords: `Lupin leadership, ${leaderName}, executive team, board of directors, Lupin Limited`,
  });
}

export default async function LeaderDetailsPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams || {};

  // Fetch leader data from Strapi
  let leaderData = null;
  let error = null;

  try {
    if (!slug) {
      error = 'Slug is required';
    } else {
      const strapiData = await getLeaderBySlug(slug);
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Leader detail page - slug:', slug);
        console.log('Leader detail page - strapiData:', strapiData);
      }
      
      leaderData = mapLeaderDetailData(strapiData);
      
      // Debug logging after mapping
      if (process.env.NODE_ENV === 'development') {
        console.log('Leader detail page - mapped leaderData:', leaderData);
      }
      
      if (!leaderData) {
        error = 'Leader not found';
      }
    }
  } catch (err) {
    console.error('Error fetching leader data from Strapi:', err);
    error = err.message || 'Failed to fetch leader data';
  }

  // Banner data - only if leaderData exists
  const bannerData = leaderData ? {
    title: {
      line1: "Our Leadership",
      line2: ""
    },
    images: {
      banner: {
        url: "/assets/leaders/Leadership_Desktop.png",
        alt: leaderData.name || ""
      },
      bannerMobile: {
        url: "/assets/leaders/Leadership_Mobile.png",
        alt: leaderData.name || ""
      },
      petal: {
        url: "/assets/inner-banner/petal-2.svg",
        alt: "Decorative petal"
      }
    }
  } : null;

  // Show error state if leader not found
  if (error || !leaderData) {
    return (
      <div style={{ position: 'relative' }}>
        <InnerBanner data={bannerData} titleAsDiv />
        <section className="leader-profile">
          <div className="leader-profile__container">
            <div className="leader-profile__content">
              <div className="leader-profile__info">
                <h1 className="leader-profile__name">Leader Not Found</h1>
                
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <LeaderDetailClient>
      <div style={{ position: 'relative' }}>
        {bannerData && <InnerBanner data={bannerData} titleAsDiv />}
      <section className="leader-profile">
        <div className="leader-profile__container">
          <div className="leader-profile__content">
            <div className="leader-profile__info">
              <div className="leader-profile__name-section">
                <h1 className="leader-profile__name">
                  {leaderData.name}
                </h1>
                <p className="leader-profile__title">
                  {leaderData.title}
                </p>
              </div>
              {leaderData.biography && (
                <div className="leader-profile__biography">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkBreaks]} 
                    rehypePlugins={[rehypeRaw]}
                  >
                    {leaderData.biography}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            {leaderData.image && (
              <div className="leader-profile__image-wrapper">
                <div className="leader-profile__image-circle">
                  <Image
                    src={leaderData.image.url}
                    alt={leaderData.image.alt || leaderData.name}
                    width={595}
                    height={595}
                    className="leader-profile__image"
                    quality={100}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {leaderData.education && leaderData.education.length > 0 && (
        <section className="leader-education">
          <div className="leader-education__container">
            <div className="leader-education__content">
              <div className="leader-education__header">
                <div className="leader-education__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                    <path d="M13.6024 12.0222C13.4346 12.0337 13.2669 11.9418 13.183 11.804L10.2235 7.0962C9.25297 5.56902 8.76172 4.31743 8.76172 3.34141C8.76172 2.30799 9.18108 1.49273 10.0078 0.895637C10.8346 0.298546 11.9728 0 13.4226 0C14.9084 0 16.1065 0.298546 16.9932 0.884154C17.8679 1.46976 18.3112 2.26206 18.3112 3.26104C18.3112 3.89257 18.1195 4.59301 17.748 5.37382C17.3766 6.13167 16.1305 8.26741 13.9858 11.7925C13.9139 11.9303 13.7581 12.0107 13.6024 12.0222Z" fill="#08A03F"/>
                    <path d="M13.5787 14.4668C13.4229 14.4668 13.2671 14.5472 13.1833 14.685L10.2118 19.4158C9.24125 20.9429 8.75 22.1945 8.75 23.1706C8.75 24.1925 9.16936 25.0192 9.9961 25.6163C10.8228 26.2134 11.9611 26.512 13.4109 26.512C14.8966 26.512 16.0948 26.2134 16.9815 25.6278C17.8561 25.0422 18.2995 24.2499 18.2995 23.2509C18.2995 22.6194 18.1078 21.919 17.7363 21.1381C17.3649 20.3803 16.1188 18.2331 13.9621 14.6964C13.9022 14.5587 13.7464 14.4668 13.5787 14.4668Z" fill="#08A03F"/>
                    <path d="M14.166 13.8934C14.1061 14.0311 14.142 14.1919 14.2379 14.3182C16.131 16.5343 18.6352 20.4958 20.8878 21.8163C21.7385 22.3215 22.6251 22.3675 23.5477 21.9656C24.4583 21.5752 25.2012 21.001 25.9321 19.8069C26.687 18.5782 27.0344 17.4529 26.9985 16.431C26.9625 15.4205 26.5192 14.6742 25.6805 14.1804C25.1533 13.8704 24.4703 13.6867 23.6436 13.6178C22.8288 13.5604 18.6472 13.5489 14.5734 13.6178C14.3937 13.6178 14.2259 13.7326 14.166 13.8934Z" fill="#08A03F"/>
                    <path d="M14.1527 12.6195C14.2246 12.7343 14.3564 12.8147 14.5002 12.8147C18.5979 12.8836 22.8275 12.8721 23.6423 12.8147C24.469 12.7458 25.14 12.562 25.6792 12.252C26.5179 11.7697 26.9612 11.0119 26.9971 10.0014C27.0331 8.9795 26.6856 7.85421 25.9308 6.62558C25.1999 5.4314 24.457 4.85727 23.5464 4.46687C22.6238 4.06498 21.7372 4.12239 20.8864 4.61614C18.6099 5.94811 16.0818 9.96699 14.1886 12.1716C14.0808 12.2979 14.0688 12.4817 14.1527 12.6195Z" fill="#08A03F"/>
                    <path d="M12.835 13.8589C12.7631 13.7096 12.6193 13.6178 12.4516 13.6178C8.3658 13.5489 4.17218 13.5604 3.35742 13.6178C2.53068 13.6867 1.84772 13.8704 1.32052 14.1804C0.481795 14.6627 0.0384702 15.4205 0.00252494 16.431C-0.0334204 17.4529 0.314051 18.5782 1.0689 19.8069C1.79979 21.001 2.54266 21.5752 3.45327 21.9656C4.37587 22.3675 5.26252 22.31 6.11322 21.8163C8.37778 20.4958 10.8939 16.5114 12.7871 14.2952C12.8829 14.1689 12.9069 14.0082 12.835 13.8589Z" fill="#08A03F"/>
                    <path d="M12.7991 12.6195C12.7272 12.7458 12.5834 12.8147 12.4276 12.8261C8.35382 12.895 4.17218 12.8836 3.35742 12.8261C2.53068 12.7572 1.84772 12.5735 1.32052 12.2635C0.481796 11.7698 0.050452 11.0119 0.00252494 10.0014C-0.0334204 8.9795 0.314051 7.85421 1.0689 6.62558C1.79979 5.4314 2.54266 4.85727 3.45327 4.46687C4.37587 4.06498 5.26252 4.12239 6.11323 4.61614C8.37778 5.93663 10.882 9.8981 12.7631 12.1142C12.7751 12.1257 12.7751 12.1372 12.7871 12.1372C12.7871 12.1487 12.9069 12.3898 12.7991 12.6195Z" fill="#08A03F"/>
                  </svg>
                </div>
                <h2 className="leader-education__title">Education</h2>
              </div>
              <div className="leader-education__text">
                {leaderData.education.map((item, index) => (
                  <div key={index}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkBreaks]} 
                      rehypePlugins={[rehypeRaw]}
                    >
                      {typeof item === 'string' ? item : String(item)}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {leaderData.infoItems && leaderData.infoItems.length > 0 && (
        <section className="leader-info-row">
          <div className="leader-info-row__container">
            <div className="leader-info-row__grid">
              {leaderData.infoItems.map((item, index) => (
                <div key={index} className="leader-info-row__item">
                  <div className="leader-education__header">
                    <div className="leader-education__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                        <path d="M13.6024 12.0222C13.4346 12.0337 13.2669 11.9418 13.183 11.804L10.2235 7.0962C9.25297 5.56902 8.76172 4.31743 8.76172 3.34141C8.76172 2.30799 9.18108 1.49273 10.0078 0.895637C10.8346 0.298546 11.9728 0 13.4226 0C14.9084 0 16.1065 0.298546 16.9932 0.884154C17.8679 1.46976 18.3112 2.26206 18.3112 3.26104C18.3112 3.89257 18.1195 4.59301 17.748 5.37382C17.3766 6.13167 16.1305 8.26741 13.9858 11.7925C13.9139 11.9303 13.7581 12.0107 13.6024 12.0222Z" fill="#08A03F"/>
                        <path d="M13.5787 14.4668C13.4229 14.4668 13.2671 14.5472 13.1833 14.685L10.2118 19.4158C9.24125 20.9429 8.75 22.1945 8.75 23.1706C8.75 24.1925 9.16936 25.0192 9.9961 25.6163C10.8228 26.2134 11.9611 26.512 13.4109 26.512C14.8966 26.512 16.0948 26.2134 16.9815 25.6278C17.8561 25.0422 18.2995 24.2499 18.2995 23.2509C18.2995 22.6194 18.1078 21.919 17.7363 21.1381C17.3649 20.3803 16.1188 18.2331 13.9621 14.6964C13.9022 14.5587 13.7464 14.4668 13.5787 14.4668Z" fill="#08A03F"/>
                        <path d="M14.166 13.8934C14.1061 14.0311 14.142 14.1919 14.2379 14.3182C16.131 16.5343 18.6352 20.4958 20.8878 21.8163C21.7385 22.3215 22.6251 22.3675 23.5477 21.9656C24.4583 21.5752 25.2012 21.001 25.9321 19.8069C26.687 18.5782 27.0344 17.4529 26.9985 16.431C26.9625 15.4205 26.5192 14.6742 25.6805 14.1804C25.1533 13.8704 24.4703 13.6867 23.6436 13.6178C22.8288 13.5604 18.6472 13.5489 14.5734 13.6178C14.3937 13.6178 14.2259 13.7326 14.166 13.8934Z" fill="#08A03F"/>
                        <path d="M14.1527 12.6195C14.2246 12.7343 14.3564 12.8147 14.5002 12.8147C18.5979 12.8836 22.8275 12.8721 23.6423 12.8147C24.469 12.7458 25.14 12.562 25.6792 12.252C26.5179 11.7697 26.9612 11.0119 26.9971 10.0014C27.0331 8.9795 26.6856 7.85421 25.9308 6.62558C25.1999 5.4314 24.457 4.85727 23.5464 4.46687C22.6238 4.06498 21.7372 4.12239 20.8864 4.61614C18.6099 5.94811 16.0818 9.96699 14.1886 12.1716C14.0808 12.2979 14.0688 12.4817 14.1527 12.6195Z" fill="#08A03F"/>
                        <path d="M12.835 13.8589C12.7631 13.7096 12.6193 13.6178 12.4516 13.6178C8.3658 13.5489 4.17218 13.5604 3.35742 13.6178C2.53068 13.6867 1.84772 13.8704 1.32052 14.1804C0.481795 14.6627 0.0384702 15.4205 0.00252494 16.431C-0.0334204 17.4529 0.314051 18.5782 1.0689 19.8069C1.79979 21.001 2.54266 21.5752 3.45327 21.9656C4.37587 22.3675 5.26252 22.31 6.11322 21.8163C8.37778 20.4958 10.8939 16.5114 12.7871 14.2952C12.8829 14.1689 12.9069 14.0082 12.835 13.8589Z" fill="#08A03F"/>
                        <path d="M12.7991 12.6195C12.7272 12.7458 12.5834 12.8147 12.4276 12.8261C8.35382 12.895 4.17218 12.8836 3.35742 12.8261C2.53068 12.7572 1.84772 12.5735 1.32052 12.2635C0.481796 11.7698 0.050452 11.0119 0.00252494 10.0014C-0.0334204 8.9795 0.314051 7.85421 1.0689 6.62558C1.79979 5.4314 2.54266 4.85727 3.45327 4.46687C4.37587 4.06498 5.26252 4.12239 6.11323 4.61614C8.37778 5.93663 10.882 9.8981 12.7631 12.1142C12.7751 12.1257 12.7751 12.1372 12.7871 12.1372C12.7871 12.1487 12.9069 12.3898 12.7991 12.6195Z" fill="#08A03F"/>
                      </svg>
                    </div>
                    <h2 className="leader-education__title">{item.label}</h2>
                  </div>
                  <div className="leader-education__text">
                    <p>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {leaderData.committeeMembership && (
        <section className="leader-education">
          <div className="leader-education__container">
            <div className="leader-education__content">
              <div className="leader-education__header">
                <div className="leader-education__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                    <path d="M13.6024 12.0222C13.4346 12.0337 13.2669 11.9418 13.183 11.804L10.2235 7.0962C9.25297 5.56902 8.76172 4.31743 8.76172 3.34141C8.76172 2.30799 9.18108 1.49273 10.0078 0.895637C10.8346 0.298546 11.9728 0 13.4226 0C14.9084 0 16.1065 0.298546 16.9932 0.884154C17.8679 1.46976 18.3112 2.26206 18.3112 3.26104C18.3112 3.89257 18.1195 4.59301 17.748 5.37382C17.3766 6.13167 16.1305 8.26741 13.9858 11.7925C13.9139 11.9303 13.7581 12.0107 13.6024 12.0222Z" fill="#08A03F"/>
                    <path d="M13.5787 14.4668C13.4229 14.4668 13.2671 14.5472 13.1833 14.685L10.2118 19.4158C9.24125 20.9429 8.75 22.1945 8.75 23.1706C8.75 24.1925 9.16936 25.0192 9.9961 25.6163C10.8228 26.2134 11.9611 26.512 13.4109 26.512C14.8966 26.512 16.0948 26.2134 16.9815 25.6278C17.8561 25.0422 18.2995 24.2499 18.2995 23.2509C18.2995 22.6194 18.1078 21.919 17.7363 21.1381C17.3649 20.3803 16.1188 18.2331 13.9621 14.6964C13.9022 14.5587 13.7464 14.4668 13.5787 14.4668Z" fill="#08A03F"/>
                    <path d="M14.166 13.8934C14.1061 14.0311 14.142 14.1919 14.2379 14.3182C16.131 16.5343 18.6352 20.4958 20.8878 21.8163C21.7385 22.3215 22.6251 22.3675 23.5477 21.9656C24.4583 21.5752 25.2012 21.001 25.9321 19.8069C26.687 18.5782 27.0344 17.4529 26.9985 16.431C26.9625 15.4205 26.5192 14.6742 25.6805 14.1804C25.1533 13.8704 24.4703 13.6867 23.6436 13.6178C22.8288 13.5604 18.6472 13.5489 14.5734 13.6178C14.3937 13.6178 14.2259 13.7326 14.166 13.8934Z" fill="#08A03F"/>
                    <path d="M14.1527 12.6195C14.2246 12.7343 14.3564 12.8147 14.5002 12.8147C18.5979 12.8836 22.8275 12.8721 23.6423 12.8147C24.469 12.7458 25.14 12.562 25.6792 12.252C26.5179 11.7697 26.9612 11.0119 26.9971 10.0014C27.0331 8.9795 26.6856 7.85421 25.9308 6.62558C25.1999 5.4314 24.457 4.85727 23.5464 4.46687C22.6238 4.06498 21.7372 4.12239 20.8864 4.61614C18.6099 5.94811 16.0818 9.96699 14.1886 12.1716C14.0808 12.2979 14.0688 12.4817 14.1527 12.6195Z" fill="#08A03F"/>
                    <path d="M12.835 13.8589C12.7631 13.7096 12.6193 13.6178 12.4516 13.6178C8.3658 13.5489 4.17218 13.5604 3.35742 13.6178C2.53068 13.6867 1.84772 13.8704 1.32052 14.1804C0.481795 14.6627 0.0384702 15.4205 0.00252494 16.431C-0.0334204 17.4529 0.314051 18.5782 1.0689 19.8069C1.79979 21.001 2.54266 21.5752 3.45327 21.9656C4.37587 22.3675 5.26252 22.31 6.11322 21.8163C8.37778 20.4958 10.8939 16.5114 12.7871 14.2952C12.8829 14.1689 12.9069 14.0082 12.835 13.8589Z" fill="#08A03F"/>
                    <path d="M12.7991 12.6195C12.7272 12.7458 12.5834 12.8147 12.4276 12.8261C8.35382 12.895 4.17218 12.8836 3.35742 12.8261C2.53068 12.7572 1.84772 12.5735 1.32052 12.2635C0.481796 11.7698 0.050452 11.0119 0.00252494 10.0014C-0.0334204 8.9795 0.314051 7.85421 1.0689 6.62558C1.79979 5.4314 2.54266 4.85727 3.45327 4.46687C4.37587 4.06498 5.26252 4.12239 6.11323 4.61614C8.37778 5.93663 10.882 9.8981 12.7631 12.1142C12.7751 12.1257 12.7751 12.1372 12.7871 12.1372C12.7871 12.1487 12.9069 12.3898 12.7991 12.6195Z" fill="#08A03F"/>
                  </svg>
                </div>
                <h2 className="leader-education__title">Committee Membership</h2>
              </div>
              <div className="leader-education__text">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]} 
                  rehypePlugins={[rehypeRaw]}
                >
                  {leaderData.committeeMembership}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </section>
      )}
      {leaderData.otherDirectorships && leaderData.otherDirectorships.pdf && leaderData.otherDirectorships.pdf.url && (
        <section className="leader-education">
          <div className="leader-education__container">
            <div className="leader-education__content">
              <div className="leader-education__header">
                <div className="leader-education__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                    <path d="M13.6024 12.0222C13.4346 12.0337 13.2669 11.9418 13.183 11.804L10.2235 7.0962C9.25297 5.56902 8.76172 4.31743 8.76172 3.34141C8.76172 2.30799 9.18108 1.49273 10.0078 0.895637C10.8346 0.298546 11.9728 0 13.4226 0C14.9084 0 16.1065 0.298546 16.9932 0.884154C17.8679 1.46976 18.3112 2.26206 18.3112 3.26104C18.3112 3.89257 18.1195 4.59301 17.748 5.37382C17.3766 6.13167 16.1305 8.26741 13.9858 11.7925C13.9139 11.9303 13.7581 12.0107 13.6024 12.0222Z" fill="#08A03F"/>
                    <path d="M13.5787 14.4668C13.4229 14.4668 13.2671 14.5472 13.1833 14.685L10.2118 19.4158C9.24125 20.9429 8.75 22.1945 8.75 23.1706C8.75 24.1925 9.16936 25.0192 9.9961 25.6163C10.8228 26.2134 11.9611 26.512 13.4109 26.512C14.8966 26.512 16.0948 26.2134 16.9815 25.6278C17.8561 25.0422 18.2995 24.2499 18.2995 23.2509C18.2995 22.6194 18.1078 21.919 17.7363 21.1381C17.3649 20.3803 16.1188 18.2331 13.9621 14.6964C13.9022 14.5587 13.7464 14.4668 13.5787 14.4668Z" fill="#08A03F"/>
                    <path d="M14.166 13.8934C14.1061 14.0311 14.142 14.1919 14.2379 14.3182C16.131 16.5343 18.6352 20.4958 20.8878 21.8163C21.7385 22.3215 22.6251 22.3675 23.5477 21.9656C24.4583 21.5752 25.2012 21.001 25.9321 19.8069C26.687 18.5782 27.0344 17.4529 26.9985 16.431C26.9625 15.4205 26.5192 14.6742 25.6805 14.1804C25.1533 13.8704 24.4703 13.6867 23.6436 13.6178C22.8288 13.5604 18.6472 13.5489 14.5734 13.6178C14.3937 13.6178 14.2259 13.7326 14.166 13.8934Z" fill="#08A03F"/>
                    <path d="M14.1527 12.6195C14.2246 12.7343 14.3564 12.8147 14.5002 12.8147C18.5979 12.8836 22.8275 12.8721 23.6423 12.8147C24.469 12.7458 25.14 12.562 25.6792 12.252C26.5179 11.7697 26.9612 11.0119 26.9971 10.0014C27.0331 8.9795 26.6856 7.85421 25.9308 6.62558C25.1999 5.4314 24.457 4.85727 23.5464 4.46687C22.6238 4.06498 21.7372 4.12239 20.8864 4.61614C18.6099 5.94811 16.0818 9.96699 14.1886 12.1716C14.0808 12.2979 14.0688 12.4817 14.1527 12.6195Z" fill="#08A03F"/>
                    <path d="M12.835 13.8589C12.7631 13.7096 12.6193 13.6178 12.4516 13.6178C8.3658 13.5489 4.17218 13.5604 3.35742 13.6178C2.53068 13.6867 1.84772 13.8704 1.32052 14.1804C0.481795 14.6627 0.0384702 15.4205 0.00252494 16.431C-0.0334204 17.4529 0.314051 18.5782 1.0689 19.8069C1.79979 21.001 2.54266 21.5752 3.45327 21.9656C4.37587 22.3675 5.26252 22.31 6.11322 21.8163C8.37778 20.4958 10.8939 16.5114 12.7871 14.2952C12.8829 14.1689 12.9069 14.0082 12.835 13.8589Z" fill="#08A03F"/>
                    <path d="M12.7991 12.6195C12.7272 12.7458 12.5834 12.8147 12.4276 12.8261C8.35382 12.895 4.17218 12.8836 3.35742 12.8261C2.53068 12.7572 1.84772 12.5735 1.32052 12.2635C0.481796 11.7698 0.050452 11.0119 0.00252494 10.0014C-0.0334204 8.9795 0.314051 7.85421 1.0689 6.62558C1.79979 5.4314 2.54266 4.85727 3.45327 4.46687C4.37587 4.06498 5.26252 4.12239 6.11323 4.61614C8.37778 5.93663 10.882 9.8981 12.7631 12.1142C12.7751 12.1257 12.7751 12.1372 12.7871 12.1372C12.7871 12.1487 12.9069 12.3898 12.7991 12.6195Z" fill="#08A03F"/>
                  </svg>
                </div>
                <h2 className="leader-education__title">Other Directorships</h2>
              </div>
              <div className="leader-education__text">
                <Link 
                  href={leaderData.otherDirectorships.pdf.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="leader-education__link"
                >
                  {leaderData.otherDirectorships.ctaName || leaderData.otherDirectorships.name || 'View PDF'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      {leaderData.pdf && (
        <section className="leader-cta">
          <div className="leader-cta__container">
            <div className="leader-cta__buttons">
              <Link 
                href={normalizeUploadUrl(leaderData.pdf.url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="leader-cta__button leader-cta__button--appointment" 
                aria-label="Appointment Resolution"
              >
                <div className="leader-cta__button-download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <rect x="3.69707" y="3.69707" width="112.403" height="112.403" rx="56.2014" fill="#126430"/>
                    <rect x="3.69707" y="3.69707" width="112.403" height="112.403" rx="56.2014" stroke="white" strokeWidth="7.39492"/>
                    <path d="M75.8765 63.0748L65.8292 62.9981V46.4316H52.0238V62.768L41.9766 62.6146L59.1566 79.7947L75.8765 63.0748Z" fill="white"/>
                  </svg>
                </div>
                <div className="leader-cta__button-text-wrapper">
                  <span className="leader-cta__button-text">{leaderData.pdf.title || 'Appointment Resolution'}</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}
      </div>
    </LeaderDetailClient>
  );
}
