'use client';

import Image from 'next/image';
import Link from 'next/link';
import NavigationLinks from './NavigationLinks';
import '../scss/components/CodeOfConduct.scss';

// Helper function to download file
const handleDownload = async (url, filename) => {
  if (!url || url === '#') return;

  try {
    // Use the API proxy route for downloads
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename || url.split('/').pop() || 'download.pdf')}`;

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || url.split('/').pop() || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback to opening in new tab if download fails
    window.open(url, '_blank');
  }
};

export default function CodeOfConduct({ data, error }) {
  // Static image paths (not data)
  const staticImages = {
    downloadButton: {
      active: "/assets/policies/download-button-active.svg",
      inactive: "/assets/policies/download-button-inactive.svg"
    },
    decorativeGroup: "/assets/policies/group.svg"
  };

  // Show error state if API failed
  if (error) {
    return (
      <section className="code-of-conduct">
        <div className="code-of-conduct__container">
          <NavigationLinks links={[
            { id: 'committees', label: 'Committees of the Board', href: '/investors/committees-of-the-board' },
            { id: 'code-of-conduct', label: 'Code of Conduct', href: '/investors/code-of-conduct' },
            { id: 'policies', label: 'Policies', href: '/investors/policies' }
          ]} />
          <div className="code-of-conduct__content">
            <div className="code-of-conduct__placeholder">
              <p>Unable to load code of conduct documents at this time. Please try again later.</p>
              {process.env.NODE_ENV === 'development' && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Error: {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!data || !data.documentSections || data.documentSections.length === 0) {
    return (
      <section className="code-of-conduct">
        <div className="code-of-conduct__container">
          <NavigationLinks links={[
            { id: 'committees', label: 'Committees of the Board', href: '/investors/committees-of-the-board' },
            { id: 'code-of-conduct', label: 'Code of Conduct', href: '/investors/code-of-conduct' },
            { id: 'policies', label: 'Policies', href: '/investors/policies' }
          ]} />
          <div className="code-of-conduct__content">
            <div className="code-of-conduct__placeholder">
              <p>No code of conduct documents available at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const codeOfConductData = data;

  return (
    <section className="code-of-conduct">
      {/* Container */}
      <div className="code-of-conduct__container">
        {/* Navigation Links */}
        <NavigationLinks links={[
          { id: 'committees', label: 'Committees of the Board', href: '/investors/committees-of-the-board' },
          { id: 'code-of-conduct', label: 'Code of Conduct', href: '/investors/code-of-conduct' },
          { id: 'policies', label: 'Policies', href: '/investors/policies' }
        ]} />

        {/* Content */}
        <div className="code-of-conduct__content">
          {/* Document Sections - DocumentSection with Language PDFs */}
          {codeOfConductData.documentSections && codeOfConductData.documentSections.length > 0 && (
            <div className="code-of-conduct__grid">
              {codeOfConductData.documentSections.map((section) => (
                <div
                  key={section.id}
                  className={`code-card`}
                >
                  <div className="code-card__content">
                    <h3 className="code-card__title">
                      <Link
                        href={section.pdfUrl || '#'}
                        className="code-card__title-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {section.pdfTitle}
                      </Link>
                    </h3>
                    {/* Language PDFs as links */}
                    {section.languagePdfs && section.languagePdfs.length > 0 && (
                      <div className="code-card__languages">
                        {section.languagePdfs.map((lang) => (
                          <Link
                            key={lang.id}
                            href={lang.pdfUrl || '#'}
                            className="code-card__language-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {lang.title}
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="code-card__download">
                      <a
                        href={section.pdfUrl || '#'}
                        className="code-card__download-link"
                        target='_blank'
                        download
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   if (section.pdfUrl && section.pdfUrl !== '#') {
                      //     handleDownload(section.pdfUrl, `${section.pdfTitle || 'code-of-conduct'}.pdf`);
                      //   }
                      // }}
                      >
                        Download
                      </a>
                      <a
                        href={section.pdfUrl || '#'}
                        className="code-card__download-button"
                        target='_blank'
                        download
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   if (section.pdfUrl && section.pdfUrl !== '#') {
                      //     handleDownload(section.pdfUrl, `${section.pdfTitle || 'code-of-conduct'}.pdf`);
                      //   }
                      // }}
                      >
                        <Image
                          src={section.isActive ? staticImages.downloadButton.active : staticImages.downloadButton.inactive}
                          alt="Download"
                          width={104}
                          height={104}
                          className="code-card__download-icon"
                          quality={100}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Decorative Group Image */}
          <div className="code-of-conduct__decorative">
            <Image
              src={staticImages.decorativeGroup}
              alt=""
              width={319}
              height={313}
              className="code-of-conduct__decorative-img"
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

