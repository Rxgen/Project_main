import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://65.2.155.211:1380';

// Helper function to check if email already exists
async function checkEmailExists(email) {
  try {
    const checkResponse = await fetch(
      `${STRAPI_URL}/api/investors-updates?filters[email][$eq]=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.STRAPI_API_TOKEN && {
            'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
          })
        },
      }
    );

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      return checkData.data && checkData.data.length > 0;
    }
    return false;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
}

// GET endpoint to check if email exists
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Validate email format - secure validation to prevent ReDoS
    // Limit email length to prevent ReDoS attacks (RFC 5321 max is 320, but we use 254 for safety)
    const MAX_EMAIL_LENGTH = 254;
    if (typeof email !== 'string' || email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Use a simple, efficient regex pattern that avoids nested quantifiers
    // Length limit above prevents ReDoS, so this simple pattern is safe
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const exists = await checkEmailExists(email);

    return NextResponse.json({
      exists,
      message: exists ? 'Email already subscribed' : 'Email is available'
    }, { status: 200 });

  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Failed to check email' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, agreed } = body;

    // Validate required fields
    if (!email || !agreed) {
      return NextResponse.json(
        { error: 'Email and agreement are required' },
        { status: 400 }
      );
    }

    // Validate email format - secure validation to prevent ReDoS
    // Limit email length to prevent ReDoS attacks (RFC 5321 max is 320, but we use 254 for safety)
    const MAX_EMAIL_LENGTH = 254;
    if (typeof email !== 'string' || email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Use a simple, efficient regex pattern that avoids nested quantifiers
    // Length limit above prevents ReDoS, so this simple pattern is safe
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'This email is already subscribed to investor updates' },
        { status: 409 } // 409 Conflict
      );
    }

    // Prepare data for Strapi
    // Based on the API response from /api/investors-updates, the content type only has 'email' field
    const strapiData = {
      data: {
        email: email
        // Note: 'agreed' field is not in the Strapi content type, so we only send email
      }
    };

    // Post to Strapi API - correct endpoint is investors-updates
    const strapiResponse = await fetch(`${STRAPI_URL}/api/investors-updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN && {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
        })
      },
      body: JSON.stringify(strapiData),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json().catch(() => ({}));
      console.error('Strapi API error:', errorData);
      console.error('Strapi response status:', strapiResponse.status);
      console.error('Sent data:', strapiData);
      
      // Return detailed error message
      const errorMessage = errorData.error?.message || 
                          errorData.message || 
                          `Strapi API error: ${strapiResponse.status} ${strapiResponse.statusText}`;
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorData,
          hint: 'Please check that the field names (email, agreed, subscribedAt) match your Strapi content type schema'
        },
        { status: strapiResponse.status }
      );
    }

    const strapiResult = await strapiResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to investor updates',
      data: strapiResult.data || {
        email,
        subscribedAt: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

