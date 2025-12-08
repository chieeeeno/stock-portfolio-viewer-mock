import PortfolioInteractive from './PortfolioInteractive';
import type { PortfolioResponse } from '@/types/portfolio';

/**
 * APIのベースURLを取得
 * 環境変数 API_BASE_URL が設定されていない場合はエラー
 */
function getApiBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error('環境変数 API_BASE_URL が設定されていません');
  }
  return baseUrl;
}

/**
 * APIからポートフォリオデータを取得
 */
async function fetchPortfolioData(): Promise<PortfolioResponse> {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/api/portfolio`, {
    cache: 'no-store', // 常に最新データを取得
  });

  if (!response.ok) {
    throw new Error('ポートフォリオデータの取得に失敗しました');
  }

  return response.json();
}

/**
 * ポートフォリオデータをフェッチして表示するサーバーコンポーネント
 */
export default async function PortfolioContent() {
  const data = await fetchPortfolioData();

  return <PortfolioInteractive data={data} />;
}
