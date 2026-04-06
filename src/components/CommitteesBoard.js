'use client';

import NavigationLinks from './NavigationLinks';
import LeaderInCircle from './global/LeaderInCircle';
import { normalizeUploadUrl } from '@/lib/strapi-utils';
import '../scss/components/CommitteesBoard.scss';

export default function CommitteesBoard({ data, error = null }) {
  // Use optional chaining - return null if no data
  if (!data?.committees || !Array.isArray(data.committees) || data.committees.length === 0) {
    if (error) {
      return (
        <section className="committees-board">
          <div className="committees-board__container">
            <NavigationLinks links={[
              { id: 'committees', label: 'Committees of the Board', href: '/investors/committees-of-the-board' },
              { id: 'code-of-conduct', label: 'Code of Conduct', href: '/investors/code-of-conduct' },
              { id: 'policies', label: 'Policies', href: '/investors/policies' }
            ]} />
            <div className="committees-board__placeholder">
              <p>Unable to load committees data at this time. Please try again later.</p>
              {process.env.NODE_ENV === 'development' && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Error: {error}
                </p>
              )}
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const committeesData = data;

  return (
    <section className="committees-board" data-node-id="2371:2">
      <div className="committees-board__container">
        {/* Navigation Links */}
        <NavigationLinks links={[
          { id: 'committees', label: 'Committees of the Board', href: '/investors/committees-of-the-board' },
          { id: 'code-of-conduct', label: 'Code of Conduct', href: '/investors/code-of-conduct' },
          { id: 'policies', label: 'Policies', href: '/investors/policies' }
        ]} />

        {/* Committees */}
        <div className="committees-board__committees">
          {committeesData?.committees?.map((committee, index) => (
            <div 
              key={committee?.id || index} 
              className="committees-board__committee"
              style={committee?.backgroundColor ? { backgroundColor: committee.backgroundColor } : {}}
            >
              <div className="committees-board__committee-inner">
                {/* Committee Title */}
                {committee?.title && (
                  <h2 className="committees-board__title">{committee.title}</h2>
                )}

                {/* Click here for charter - only show if PDF exists */}
                {committee?.pdfUrl && (
                  <div className="committees-board__charter-link-wrapper">
                    <a
                      href={normalizeUploadUrl(committee.pdfUrl) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="committees-board__charter-link"
                    >
                      Click here for charter
                    </a>
                  </div>
                )}

                {/* Members Grid */}
                {committee?.members && Array.isArray(committee.members) && committee.members.length > 0 && (
                  <div className="committees-board__members">
                    {committee.members.map((member) => (
                      <LeaderInCircle
                        key={member?.id}
                        id={member?.id}
                        name={member?.name}
                        title={member?.title}
                        image={member?.image}
                        isSpecial={member?.isSpecial}
                        size={member?.size}
                        link={member?.link || '#'}
                        className="committees-board__member"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

