import { NextResponse } from 'next/server';
import { generateCreativeResponse } from '@/lib/ai/creativeEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateCreativeResponse(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI creative request' },
      { status: 500 }
    );
  }
}
