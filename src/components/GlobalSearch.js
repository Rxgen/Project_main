"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "../scss/components/GlobalSearch.scss";

/**
 * GlobalSearch Component
 *
 * Features:
 * - Search input with debounce
 * - Fetches from /api/search?q=
 * - Shows grouped results: Pages, Articles, Media, News, Events, Community, About Us, Emerging Markets
 */
export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({
    pages: [],
    articles: [],
    media: [],
    news: [],
    events: [],
    community: [],
    aboutUs: [],
    strapiPages: [],
    emergingMarkets: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const logo = {
    url: "/assets/logo-lupin.png",
    alt: "Lupin Logo",
  };

  // Lock body scroll when overlay is open so the page behind never moves
  useEffect(() => {
    if (isExpanded) {
      const scrollY = window.scrollY ?? window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.documentElement.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top
        ? Math.abs(parseInt(document.body.style.top, 10))
        : 0;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.documentElement.style.overflow = "";
    };
  }, [isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Debounced search
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If query is empty, clear results
    if (!searchQuery.trim()) {
      setResults({
        pages: [],
        articles: [],
        media: [],
        news: [],
        events: [],
        community: [],
        aboutUs: [],
        strapiPages: [],
        emergingMarkets: [],
      });
      setHasSearched(false);
      setShowResults(false);
      return;
    }

    // Set loading state
    setIsLoading(true);
    setHasSearched(true);

    // Debounce API call
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery.trim())}`,
        );
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults({
          pages: [],
          articles: [],
          media: [],
          news: [],
          events: [],
          community: [],
          aboutUs: [],
          strapiPages: [],
          emergingMarkets: [],
        });
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults({
      pages: [],
      articles: [],
      media: [],
      news: [],
      events: [],
      community: [],
      aboutUs: [],
      strapiPages: [],
      emergingMarkets: [],
    });
    setShowResults(false);
    setHasSearched(false);
  };

  const handleSearchIconClick = () => {
    setIsExpanded(true);
  };

  const handleResultClick = () => {
    // Close results and collapse when a result is clicked
    setShowResults(false);
    setIsExpanded(false);
    setSearchQuery("");
  };

  // Calculate total results count
  const totalResults =
    results.pages.length +
    results.articles.length +
    results.media.length +
    results.news.length +
    results.events.length +
    results.community.length +
    results.aboutUs.length +
    results.strapiPages.length +
    results.emergingMarkets.length;

  return (
    <>
      {/* Search Icon Button (Collapsed State) */}
      {!isExpanded && (
        <button
          type="button"
          className="global-search__icon-button"
          onClick={handleSearchIconClick}
          aria-label="Open search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
            <path
              d="M15 15L13 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {/* Full Page Search Overlay */}
      {isExpanded && (
        <div
          className={`global-search-overlay ${isExpanded ? "global-search-overlay--active" : ""}`}
          ref={searchRef}
        >
          <div className="global-search-overlay__container">
            {/* Close Button */}
            <button
              type="button"
              className="global-search-overlay__close"
              onClick={() => {
                setIsExpanded(false);
                setSearchQuery("");
                setShowResults(false);
              }}
              aria-label="Close search"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="global-search-overlay__input-block">
              <div className="global-search-overlay__search-section">
                <div className="global-search-overlay__input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    className="global-search-overlay__input"
                    placeholder="Lupin"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (hasSearched && totalResults > 0) {
                        setShowResults(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsExpanded(false);
                        setSearchQuery("");
                        setShowResults(false);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="global-search-overlay__search-button"
                    aria-label="Search"
                  >
                    {isLoading ? (
                      <div
                        className="global-search-overlay__spinner"
                        aria-label="Loading"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="32"
                            strokeDashoffset="32"
                            opacity="0.3"
                          />
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="32"
                            strokeDashoffset="24"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              values="32;0"
                              dur="1s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>
                      </div>
                    ) : (
                      <Image
                        src="/assets/search/icons/search-icon.png"
                        alt="Search"
                        width={20}
                        height={20}
                        className="global-search-overlay__search-icon"
                      />
                    )}
                  </button>
                </div>
                {searchQuery.trim() && (
                  <div>
                    <h2 className="global-search-overlay__results-title">
                      Search Results
                    </h2>
                  </div>
                )}
              </div>
            </div>

            {/* Results in separate panel below – does not push input; scrollbar hidden */}
            {showResults && (
              <div
                className="global-search-overlay__results-panel"
                ref={resultsRef}
              >
                {isLoading ? (
                  <div className="global-search-overlay__loading">
                    Searching...
                  </div>
                ) : totalResults === 0 ? (
                  <div className="global-search-overlay__no-results">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="global-search-overlay__results-content">
                    <div className="global-search-overlay__results-list">
                      {(() => {
                        // Combine all results
                        const allResults = [
                          ...results.pages.map((page) => ({
                            ...page,
                            type: "page",
                          })),
                          ...results.articles.map((article) => ({
                            ...article,
                            type: "article",
                          })),
                          ...(results.media || []).map((item) => ({
                            ...item,
                            type: "media",
                          })),
                          ...results.news.map((news) => ({
                            ...news,
                            type: "news",
                          })),
                          ...results.events.map((event) => ({
                            ...event,
                            type: "event",
                          })),
                          ...results.community.map((community) => ({
                            ...community,
                            type: "community",
                          })),
                          ...results.aboutUs.map((item) => ({
                            ...item,
                            type: "about-us",
                          })),
                          ...(results.strapiPages || []).map((item) => ({
                            ...item,
                            type: item.type || "strapi-page",
                          })),
                          ...results.emergingMarkets.map((market) => ({
                            ...market,
                            type: "emerging-market",
                          })),
                        ];

                        // Deduplicate by URL - keep first occurrence
                        const seenUrls = new Set();
                        const uniqueResults = allResults.filter((result) => {
                          const url = result.url || result.id || "";
                          if (seenUrls.has(url)) {
                            return false; // Skip duplicate
                          }
                          seenUrls.add(url);
                          return true; // Keep first occurrence
                        });

                        return uniqueResults;
                      })().map((result, index) => {
                        // Get all available content to search for query match
                        const fullContent =
                          result.description ||
                          result.content ||
                          result.title ||
                          "";
                        const searchQueryLower = searchQuery
                          .trim()
                          .toLowerCase();
                        const searchTerms = searchQueryLower
                          .split(/\s+/)
                          .filter((term) => term.length > 0);

                        // Find content that contains the search query
                        let subtitle = "";

                        if (searchTerms.length > 0 && fullContent) {
                          // Try to find a snippet that contains the search query
                          const contentLower = fullContent.toLowerCase();

                          // Find the first occurrence of any search term
                          let matchIndex = -1;
                          let matchedTerm = "";

                          for (const term of searchTerms) {
                            const index = contentLower.indexOf(term);
                            if (index !== -1) {
                              matchIndex = index;
                              matchedTerm = term;
                              break;
                            }
                          }

                          if (matchIndex !== -1) {
                            // Extract snippet around the match (150 chars total, with match in center)
                            const start = Math.max(0, matchIndex - 50);
                            const end = Math.min(
                              fullContent.length,
                              matchIndex + matchedTerm.length + 100,
                            );
                            let snippet = fullContent.substring(start, end);

                            // Add ellipsis if needed
                            if (start > 0) snippet = "..." + snippet;
                            if (end < fullContent.length)
                              snippet = snippet + "...";

                            subtitle = snippet;
                          } else {
                            // If no match found, use first 150 chars of description
                            subtitle =
                              fullContent.length > 150
                                ? fullContent.substring(0, 150) + "..."
                                : fullContent;
                          }
                        } else {
                          // No search query, use description or first 150 chars
                          subtitle =
                            fullContent.length > 150
                              ? fullContent.substring(0, 150) + "..."
                              : fullContent;
                        }

                        // Limit subtitle length if still too long
                        if (subtitle.length > 150) {
                          const sentences =
                            subtitle.match(/[^.!?]+[.!?]+/g) || [];
                          if (sentences.length > 2) {
                            subtitle = sentences.slice(0, 2).join(" ");
                          } else {
                            subtitle = subtitle.substring(0, 150) + "...";
                          }
                        }

                        // Highlight search keywords in subtitle
                        const highlightKeywords = (text, query) => {
                          if (!query || !text) return text;
                          const searchTerms = query
                            .trim()
                            .toLowerCase()
                            .split(/\s+/)
                            .filter((term) => term.length > 0);
                          if (searchTerms.length === 0) return text;

                          let highlightedText = text;
                          searchTerms.forEach((term) => {
                            // Create a regex that matches the term case-insensitively
                            const regex = new RegExp(
                              `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                              "gi",
                            );
                            highlightedText = highlightedText.replace(
                              regex,
                              (match) => {
                                return `<mark>${match}</mark>`;
                              },
                            );
                          });
                          return highlightedText;
                        };

                        const highlightedSubtitle =
                          subtitle && subtitle !== result.title
                            ? highlightKeywords(subtitle, searchQuery)
                            : null;

                        return (
                          <Link
                            key={result.id || index}
                            href={result.url || "#"}
                            className="global-search-overlay__result-card"
                            onClick={handleResultClick}
                            target="_blank"
                          >
                            <h3 className="global-search-overlay__result-title">
                              {result.title}
                            </h3>
                            {highlightedSubtitle && (
                              <p
                                className="global-search-overlay__result-subtitle"
                                dangerouslySetInnerHTML={{
                                  __html: highlightedSubtitle,
                                }}
                              />
                            )}
                            <span className="global-search-overlay__result-line"></span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
