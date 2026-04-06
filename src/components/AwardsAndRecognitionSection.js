'use client';

import { useState, useEffect } from 'react';
import OurStoryYearSelector from '@/components/OurStoryYearSelector';
import AwardsAndRecognitionYears from '@/components/AwardsAndRecognitionYears';
import '@/scss/components/AwardsAndRecognitionSection.scss';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms-lupin-uat-ckhucnecaybdhdhv.centralindia-01.azurewebsites.net';

export default function AwardsAndRecognitionSection() {
  const [years, setYears] = useState([]);
  const [awardsData, setAwardsData] = useState({});
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/our-story?populate[ourMilestones][populate][year][populate][Milestones]=*`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(process.env.NEXT_PUBLIC_STRAPI_API_TOKEN && {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
              })
            },
            cache: 'no-store'
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data?.data?.ourMilestones?.year) {
          // Transform Strapi data to component format
          const yearData = data.data.ourMilestones.year;
          
          // Extract years and convert to numbers, sort descending
          const yearsList = yearData
            .map(item => parseInt(item.title))
            .filter(year => !isNaN(year))
            .sort((a, b) => b - a);
          
          // Create awards data object keyed by year
          const awardsObj = {};
          yearData.forEach(item => {
            const year = parseInt(item.title);
            if (!isNaN(year) && item.Milestones) {
              awardsObj[year] = item.Milestones.map(milestone => milestone.heading);
            }
          });
          
          setYears(yearsList);
          setAwardsData(awardsObj);
          
          // Set default active year to the first (most recent) year
          if (yearsList.length > 0) {
            setActiveYear(yearsList[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching milestones:', error);
        // Fallback to default data
        const defaultYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
        setYears(defaultYears);
        setActiveYear(2023);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  const handleYearChange = (year) => {
    setActiveYear(year);
  };

  if (loading) {
    return (
      <section className="awards-and-recognition-section">
        <div className="awards-and-recognition-section__year-selector-wrapper">
          <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>
            Loading...
          </div>
        </div>
      </section>
    );
  }

  if (!activeYear || years.length === 0) {
    return null;
  }

  return (
    <section className="awards-and-recognition-section">
      <div className="awards-and-recognition-section__year-selector-wrapper">
        <OurStoryYearSelector 
          years={years}
          activeYear={activeYear}
          onYearChange={handleYearChange}
        />
      </div>
      <AwardsAndRecognitionYears 
        activeYear={activeYear}
        awardsData={awardsData}
        years={years}
        onYearChange={handleYearChange}
      />
    </section>
  );
}

