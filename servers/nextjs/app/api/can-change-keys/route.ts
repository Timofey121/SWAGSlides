import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Default: locked configuration unless explicitly enabled
const canChangeKeys = process.env.CAN_CHANGE_KEYS === "true";

export async function GET() {
  return NextResponse.json({ canChange: canChangeKeys })
}