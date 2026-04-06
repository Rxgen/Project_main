import { NextResponse } from 'next/server';
import { fetchAPI } from '@/lib/strapi';

export async function GET(request) {
  try {
    // Check if Strapi URL is configured
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      return NextResponse.json({
        geography: [],
        category: [],
        oncology: []
      });
    }

    // Fetch product categories from product-categories endpoint
    let categoryOptions = [];
    try {
      const categoriesResponse = await fetchAPI('product-categories?pagination[page]=1&pagination[pageSize]=100', {
        cache: 'no-store',
      });

      if (categoriesResponse && categoriesResponse.data) {
        categoryOptions = categoriesResponse.data.map((item) => {
          const category = item.attributes || item;
          const name = category.name || '';
          const id = item.id || item.documentId || '';
          return {
            value: name, // Use name for filtering (as per current implementation)
            label: name
          };
        }).filter(option => option.value && option.label);
      }
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }

    // Fetch product geographies from product-geographies endpoint
    let geographyOptions = [];
    try {
      const geographiesResponse = await fetchAPI('product-geographies?pagination[page]=1&pagination[pageSize]=100', {
        cache: 'no-store',
      });

      if (geographiesResponse && geographiesResponse.data) {
        geographyOptions = geographiesResponse.data.map((item) => {
          const geography = item.attributes || item;
          const name = geography.name || '';
          const id = item.id || item.documentId || '';
          return {
            value: id.toString(), // Use ID for relation filtering
            label: name
          };
        }).filter(option => option.value && option.label);
      }
    } catch (error) {
      console.error('Error fetching product geographies:', error);
    }

    // Fetch product therapies from product-therapies endpoint
    let therapyOptions = [];
    try {
      const therapiesResponse = await fetchAPI('product-therapies?pagination[page]=1&pagination[pageSize]=100', {
        cache: 'no-store',
      });

      if (therapiesResponse && therapiesResponse.data) {
        therapyOptions = therapiesResponse.data.map((item) => {
          const therapy = item.attributes || item;
          const name = therapy.name || '';
          const id = item.id || item.documentId || '';
          return {
            value: id.toString(), // Use ID for relation filtering
            label: name
          };
        }).filter(option => option.value && option.label);
      }
    } catch (error) {
      console.error('Error fetching product therapies:', error);
    }

    return NextResponse.json({
      geography: geographyOptions, // Use product geographies from API
      category: categoryOptions, // Use product categories from API
      oncology: therapyOptions // Use product therapies from API (mapped to oncology in UI)
    });
  } catch (error) {
    console.error('Error fetching product filters:', error);
    return NextResponse.json({
      geography: [],
      category: [],
      oncology: []
    }, { status: 200 });
  }
}

