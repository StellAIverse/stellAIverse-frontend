import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, you'd want to use a database
const waitlistEmails: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (waitlistEmails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 409 }
      );
    }

    // Add to waitlist
    waitlistEmails.push(email.toLowerCase());

    // Log for demonstration (remove in production)
    console.log(`Added to waitlist: ${email}`);
    console.log(`Total waitlist size: ${waitlistEmails.length}`);

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Maybe trigger a webhook to your email marketing service

    return NextResponse.json(
      { 
        message: 'Successfully added to waitlist',
        position: waitlistEmails.length 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // For demonstration purposes - remove in production
  return NextResponse.json({
    count: waitlistEmails.length,
    message: 'Waitlist endpoint is active'
  });
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
