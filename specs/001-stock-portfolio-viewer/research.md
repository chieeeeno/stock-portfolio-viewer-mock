# Research: 株式ポートフォリオビューワー

**Date**: 2025-12-06
**Feature Branch**: `001-stock-portfolio-viewer`

## 1. フレームワークバージョン

### Decision: Next.js 15 (安定版)

**Rationale**:
- Next.js 16は2025年10月にリリースされたが、セキュリティ脆弱性(CVE-2025-66478)が報告されている
- 試験要件は「できるだけ最新版」だが、安定性を考慮しNext.js 15の最新安定版を使用
- App Router（推奨）を使用
- Turbopackはdev環境で使用可能

**Alternatives Considered**:
- Next.js 16: 最新だがセキュリティ問題が懸念
- Next.js 14: 安定しているが、最新版を使用という要件に反する

**Key Configuration**:
- App Router (src/app/ ディレクトリ)
- TypeScript 5.x
- pnpm パッケージマネージャー

---

## 2. パイチャートライブラリ

### Decision: Recharts

**Rationale**:
1. **中央ラベル対応**: ネイティブサポート（プラグイン不要）
2. **バンドルサイズ**: 45KB gzipped（最小）
3. **クリック/タップ**: シンプルなonClickハンドラで実装可能
4. **TypeScript**: 完全な型定義
5. **レスポンシブ**: 組み込みサポート
6. **学習曲線**: 浅い（1-2時間）

**Alternatives Considered**:

| ライブラリ | バンドルサイズ | 中央ラベル | 評価 |
|-----------|--------------|----------|------|
| **Recharts** | 45KB | ネイティブ | ⭐ 採用 |
| Nivo | 65-80KB | 可能（layers） | 代替案 |
| Chart.js | 50-80KB | プラグイン必要 | 不採用 |
| Victory | 70KB | 手動実装 | 不採用 |

**Implementation Pattern**:
```typescript
// 疑似コード
const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

<PieChart>
  <Pie
    data={sortedHoldings}
    innerRadius={80}   // ドーナツ形状
    outerRadius={120}
    startAngle={90}    // 12時起点
    onClick={(_, index) => setFocusedIndex(index)}
  >
    {holdings.map((_, idx) => (
      <Cell
        opacity={focusedIndex === null || focusedIndex === idx ? 1 : 0.3}
      />
    ))}
  </Pie>
  {/* 中央ラベル: SVG text要素 */}
</PieChart>
```

---

## 3. スタイリング

### Decision: Tailwind CSS

**Rationale**:
1. **PDFで許可**: 「Tailwind CSSなどのユーティリティファーストなCSSフレームワーク」が明示的に許可
2. **開発速度**: ユーティリティクラスで高速なスタイリング
3. **レスポンシブ**: 組み込みのブレークポイント（sm, md, lg）
4. **バンドルサイズ**: PurgeCSSで未使用CSSを除去
5. **Next.js統合**: 公式サポート

**Alternatives Considered**:
- CSS Modules: 良い選択だが、レスポンシブが冗長になりがち
- Styled Components: ランタイムコストあり
- Sass: 設定が追加で必要

**Color Palette** (評価損益):
```css
/* 緑（プラス） */ text-green-500 (#22c55e)
/* 赤（マイナス） */ text-red-500 (#ef4444)
/* グレー（ゼロ） */ text-gray-500 (#6b7280)
```

---

## 4. テストフレームワーク

### Decision: Vitest + React Testing Library

**Rationale**:
1. **パフォーマンス**: Jestより2-10倍高速
2. **TypeScript**: ゼロコンフィグでTypeScriptサポート
3. **ESM**: ネイティブESMサポート
4. **設定**: 最小限の設定で開始可能
5. **Next.js互換**: 良好な互換性

**Alternatives Considered**:
- Jest + RTL: 成熟しているが、設定が複雑でVitest より遅い
- Playwright: E2Eテストに適しているが、コンポーネントテストには過剰

**Test Strategy**:
- **コンポーネントテスト**: Vitest + React Testing Library
- **ユーティリティテスト**: Vitest
- **E2Eテスト**: 今回のスコープでは省略（要件に明示なし）

**Test Files**:
```
__tests__/
├── components/
│   ├── PortfolioChart.test.tsx
│   └── AssetList.test.tsx
└── utils/
    └── formatters.test.ts
```

---

## 5. リンター/フォーマッター

### Decision: ESLint + Prettier

**Rationale**:
1. **業界標準**: 最も広く使用されている組み合わせ
2. **Next.js統合**: `next lint` で組み込みESLint設定
3. **TypeScript**: `@typescript-eslint` プラグイン
4. **自動フォーマット**: Prettierで一貫したコードスタイル

**Configuration Files**:
- `.eslintrc.json`: ESLint設定
- `.prettierrc`: Prettier設定
- `.prettierignore`: フォーマット除外ファイル

**Recommended Rules**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ]
}
```

---

## 6. プロジェクト構造

### Decision: App Router + Feature-based Structure

**Rationale**:
1. **Next.js推奨**: App Routerが推奨アーキテクチャ
2. **シンプル**: 単一ページアプリケーションなので複雑な構造は不要
3. **保守性**: コンポーネント、型、ユーティリティを明確に分離

**Directory Structure**:
```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── PortfolioChart.tsx  # ドーナツチャート
│   ├── AssetList.tsx       # 銘柄一覧
│   └── AssetCard.tsx       # 個別銘柄カード
├── types/
│   └── portfolio.ts        # TypeScript型定義
├── utils/
│   └── formatters.ts       # 数値フォーマット
└── data/
    └── dummy_response.json # モックデータ
```

---

## 7. 依存パッケージ一覧

### Production Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "recharts": "^2.12.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.0.0",
  "@types/react": "^19.0.0",
  "@types/node": "^20.0.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.0.0",
  "autoprefixer": "^10.0.0",
  "eslint": "^9.0.0",
  "eslint-config-next": "^15.0.0",
  "prettier": "^3.0.0",
  "eslint-config-prettier": "^9.0.0",
  "vitest": "^2.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "@testing-library/react": "^16.0.0",
  "jsdom": "^25.0.0"
}
```

---

## 8. パフォーマンス考慮事項

### Decision: クライアントサイドレンダリング（CSR）

**Rationale**:
1. **SPA要件**: PDFで「SPAを構築」と明記
2. **モックデータ**: サーバーサイドデータ取得は不要
3. **インタラクティブ**: フォーカス機能はクライアントサイド

**Optimization**:
- Rechartsの`ResponsiveContainer`で動的サイズ調整
- 画像（ロゴ）は`next/image`で最適化
- Tailwind CSSのPurgeCSSで未使用CSS除去

---

## 9. 未解決事項

### Resolved:
- ✅ Next.jsバージョン: 15（安定版）
- ✅ パイチャートライブラリ: Recharts
- ✅ スタイリング: Tailwind CSS
- ✅ テスト: Vitest + RTL
- ✅ リンター: ESLint + Prettier

### No Clarification Needed:
- データ形式: PDFで明確に定義済み
- 色分け: PDFで緑/赤/グレーと明記
- レスポンシブ: PC/スマートフォン対応と明記

---

## 10. 次のステップ

1. **data-model.md**: TypeScript型定義の設計
2. **contracts/**: データ構造の契約定義
3. **quickstart.md**: セットアップ手順
4. **plan.md**: 実装計画の完成
