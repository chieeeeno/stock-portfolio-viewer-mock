import { NextResponse } from 'next/server';
import portfolioData from '@/data/dummy_response.json';

/**
 * ポートフォリオデータを返すAPIエンドポイント
 * モックデータ（dummy_response.json）を返す
 */
export async function GET() {
  return NextResponse.json(portfolioData);
}
