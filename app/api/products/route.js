import { NextResponse } from 'next/server';
import { inventory } from '../../../data/inventory';

export async function GET() {
  // Return the robust local JSON array holding dummy jewelry objects
  return NextResponse.json(inventory);
}
