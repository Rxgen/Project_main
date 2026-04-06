'use client';

import { useState, useEffect } from 'react';
import InnerBanner from '@/components/InnerBanner';
import MediaNavigation from '@/components/MediaNavigation';
import ProfileCard from '@/components/global/ProfileCard';
import PdfDownload from '@/components/global/PdfDownload';
import Pagination from '@/components/global/Pagination';
import MediaContact from '@/components/global/MediaContact';
import '@/scss/pages/media.scss';

export default function MediaKitClient({ initialProfiles, initialPdfs }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'profiles', 'pdfs'
    const itemsPerPage = 6;

    // Banner data for Media Kit page
    const bannerData = {
        title: {
            line1: "Media Kit",
        },
        images: {
            banner: {
                url: "/assets/inner-banner/media-kit.png",
                alt: "Product Finder"
            },
            bannerMobile: {
                url: "/assets/inner-banner/media-kit-mobile.png",
                alt: "Product Finder"
            },
            petal: {
                url: "/assets/inner-banner/petal-2.svg",
                alt: "Decorative petal"
            }
        }
    };

    // Use initial data from server
    const allProfiles = initialProfiles || [];
    const allPdfs = initialPdfs || [];

    // Combine all items for filtering
    const allItems = [
        ...allProfiles.map(item => ({ ...item, type: 'profile' })),
        ...allPdfs.map(item => ({ ...item, type: 'pdf' }))
    ];

    // Filter by tab only
    let filteredByTab = allItems;
    if (activeTab === 'profiles') {
        filteredByTab = allItems.filter(item => item.type === 'profile');
    } else if (activeTab === 'pdfs') {
        filteredByTab = allItems.filter(item => item.type === 'pdf');
    }

    // Pagination logic
    const totalItems = filteredByTab.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = filteredByTab.slice(startIndex, endIndex);

    // Separate current page items by type
    const currentProfiles = currentPageItems.filter(item => item.type === 'profile');
    const currentPdfs = currentPageItems.filter(item => item.type === 'pdf');

    // Reset to page 1 when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top of content section when page changes
            const contentSection = document.querySelector('.sectionProfileCards, .sectionPdfDownload');
            if (contentSection) {
                contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <InnerBanner data={bannerData} />
            <MediaNavigation hideSearch={true} />


            {/* Profile Cards Section */}
            {currentProfiles.length > 0 && (
                <section className="sectionProfileCards">
                    <div className="profile-cards-container">
                        <div className="profile-card-grid">
                            {currentProfiles.map((profile) => (
                                <ProfileCard
                                    key={profile.id}
                                    name={profile.name}
                                    title={profile.title}
                                    link={profile.link}
                                    image={profile.image}
                                    showArrow={true}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PDF Download Section */}
            {currentPdfs.length > 0 && (
                <section className="sectionPdfDownload">
                    <div className="pdf-download-container">
                        {currentPdfs.map((pdf) => (
                            <PdfDownload
                                key={pdf.id}
                                title={pdf.title}
                                pdfUrl={pdf.pdfUrl}
                                image={pdf.image}
                                imageAlt={pdf.imageAlt || pdf.title}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* No Results Message */}
            {filteredByTab.length === 0 && (
                <section className="sectionProfileCards">
                    <div className="profile-cards-container">
                        <div className="profile-cards-no-results">
                            <p>No items found.</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-container" style={{ padding: '40px 0' }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <MediaContact
                contact={{
                    name: "Rajalakshmi Azariah",
                    title: "Vice President and Global Head – Corporate Communications",
                    email: "rajalakshmiazariah@lupin.com"
                }}
                /* mediaKitLink="/media/media-kit" */
            />
        </div>
    );
}
