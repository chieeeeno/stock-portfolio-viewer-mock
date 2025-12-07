# タスク一覧: 株式ポートフォリオビューワー

**入力**: `/specs/001-stock-portfolio-viewer/` の設計ドキュメント
**前提条件**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**テスト**: 要件にテストコード作成が含まれるため、テストタスクを含む

**構成**: ユーザーストーリー別にタスクを整理し、各ストーリーを独立して実装・テスト可能にする

## フォーマット: `[ID] [P?] [Story] 説明`

- **[P]**: 並列実行可能（別ファイル、依存なし）
- **[Story]**: 対応するユーザーストーリー（例: US1, US2, US3, US4）
- 説明には正確なファイルパスを含める

## パス規約

- **プロジェクトタイプ**: Web SPA（フロントエンドのみ）
- **ソースコード**: リポジトリルートの `src/`
- **テスト**: テスト対象と同階層に `*.test.ts(x)` 形式で配置

---

## フェーズ1: セットアップ（共通インフラ）

**目的**: プロジェクト初期化と基本構造の作成

- [x] T001 Next.js 16プロジェクトをTypeScript、Tailwind CSS、ESLintで作成（`pnpm create next-app@latest`）
- [x] T002 本番依存パッケージをインストール: recharts, react-is
- [x] T003 [P] 開発依存パッケージをインストール: vitest, @vitejs/plugin-react, @testing-library/react, @testing-library/dom, jsdom, prettier, eslint-config-prettier
- [x] T004 [P] Vitest設定ファイルを作成 `vitest.config.ts`
- [x] T005 [P] Vitestセットアップファイルを作成 `vitest.setup.ts`
- [x] T006 [P] Prettier設定ファイルを作成 `.prettierrc`
- [x] T007 ESLint設定にprettierを追加 `eslint.config.mjs`
- [x] T008 `package.json` のscriptsを更新（test, test:run, format, format:check）
- [x] T009 ディレクトリ構造を作成: `src/components/`, `src/types/`, `src/utils/`, `src/data/`

---

## フェーズ2: 基盤（ブロッキング前提条件）

**目的**: すべてのユーザーストーリー実装前に完了必須のコアインフラ

**⚠️ 重要**: このフェーズが完了するまでユーザーストーリーの作業は開始できない

- [x] T010 [P] Asset インターフェースのTypeScript型を作成 `src/types/portfolio.ts`
- [x] T011 [P] HoldingAsset インターフェースのTypeScript型を作成 `src/types/portfolio.ts`
- [x] T012 [P] PortfolioResponse インターフェースのTypeScript型を作成 `src/types/portfolio.ts`
- [x] T013 [P] GainStatus と GainStatusInfo のTypeScript型を作成 `src/types/portfolio.ts`
- [x] T014 5件のサンプル銘柄を含むモックデータファイルを作成 `src/data/dummy_response.json`
- [x] T015 [P] formatCurrency ユーティリティ関数を実装 `src/utils/formatters.ts`
- [x] T016 [P] formatGainRatio ユーティリティ関数を実装 `src/utils/formatters.ts`
- [x] T017 [P] formatHoldingRatio ユーティリティ関数を実装 `src/utils/formatters.ts`
- [x] T018 [P] formatGainAmount ユーティリティ関数を実装 `src/utils/formatters.ts`
- [x] T019 [P] getGainStatus ユーティリティ関数を実装 `src/utils/formatters.ts`
- [x] T020 フォーマッターユーティリティのユニットテストを作成 `src/utils/formatters.test.ts`
- [x] T021 [P] CHART_COLORS 定数配列を定義 `src/utils/constants.ts`
- [x] T022 [P] GAIN_COLORS 定数オブジェクトを定義 `src/utils/constants.ts`
- [x] T023 Tailwind CSSのベースインポートで `src/app/globals.css` を更新

**チェックポイント**: 基盤完了 - ユーザーストーリーの実装を開始可能

---

## フェーズ3: ユーザーストーリー1 - ポートフォリオ全体像の確認 (優先度: P1) 🎯 MVP

**ゴール**: 顧客が保有株式の全体像をドーナツ型パイチャートで視覚的に把握できる

**独立テスト**: パイチャートと中央の数値（資産総額、評価損益率、評価損益額）が正しく表示される

### US1のテスト

- [ ] T024 [P] [US1] PortfolioChartの描画コンポーネントテストを作成 `src/components/PortfolioChart.test.tsx`
- [ ] T025 [P] [US1] チャート中央ラベル表示のテストを作成（総額、損益率、損益額） `src/components/PortfolioChart.test.tsx`
- [ ] T026 [P] [US1] 損益色ロジックのテストを作成（緑/赤/グレー） `src/components/PortfolioChart.test.tsx`

### US1の実装

- [ ] T027 [US1] 'use client'ディレクティブ付きでPortfolioChartコンポーネントの骨格を作成 `src/components/PortfolioChart.tsx`
- [ ] T028 [US1] ドーナツ形状のRecharts PieChartを実装（innerRadius, outerRadius） `src/components/PortfolioChart.tsx`
- [ ] T029 [US1] チャートを12時位置起点（startAngle={90}）で時計回り順に設定 `src/components/PortfolioChart.tsx`
- [ ] T030 [US1] 資産総額を表示する中央ラベルを実装（¥115,500形式） `src/components/PortfolioChart.tsx`
- [ ] T031 [US1] 評価損益を「+15.5%(¥15,500)」形式で表示する中央ラベルを実装 `src/components/PortfolioChart.tsx`
- [ ] T032 [US1] 損益額に基づいて中央ラベルに損益色（緑/赤/グレー）を適用 `src/components/PortfolioChart.tsx`
- [ ] T033 [US1] CHART_COLORS定数を使用してチャートセグメントの色を追加 `src/components/PortfolioChart.tsx`
- [ ] T034 [US1] 描画前にholding_ratioの降順で銘柄をソート `src/components/PortfolioChart.tsx`
- [ ] T035 [US1] モックデータを読み込みPortfolioChartを表示する基本的なpage.tsxを作成 `src/app/page.tsx`
- [ ] T036 [US1] ローディング状態の処理を追加 `src/app/page.tsx`
- [ ] T037 [US1] エラー状態の処理を追加 `src/app/page.tsx`

**チェックポイント**: パイチャートが正しく表示され、中央に資産総額と評価損益が表示される

---

## フェーズ4: ユーザーストーリー2 - 保有銘柄詳細情報の確認 (優先度: P2)

**ゴール**: 顧客がパイチャートの下で個別銘柄の詳細情報を確認できる

**独立テスト**: 銘柄一覧に各銘柄のロゴ、名前、ティッカー、比率、金額、評価損益が表示される

### US2のテスト

- [ ] T038 [P] [US2] AssetCardの描画コンポーネントテストを作成 `src/components/AssetCard.test.tsx`
- [ ] T039 [P] [US2] AssetListの描画コンポーネントテストを作成 `src/components/AssetList.test.tsx`
- [ ] T040 [P] [US2] 「VOO / 39.8%」形式の表示テストを作成 `src/components/AssetCard.test.tsx`
- [ ] T041 [P] [US2] 「+12.87%(¥5,242)」形式の損益表示テストを作成 `src/components/AssetCard.test.tsx`

### US2の実装

- [ ] T042 [US2] AssetCardコンポーネントの骨格を作成 `src/components/AssetCard.tsx`
- [ ] T043 [US2] next/imageでロゴ画像表示を実装、エラー時はティッカーシンボルにフォールバック `src/components/AssetCard.tsx`
- [ ] T044 [US2] 銘柄名の表示を実装 `src/components/AssetCard.tsx`
- [ ] T045 [US2] 「VOO / 39.8%」形式でティッカー/比率の表示を実装 `src/components/AssetCard.tsx`
- [ ] T046 [US2] 保有金額の表示を実装（¥45,969形式） `src/components/AssetCard.tsx`
- [ ] T047 [US2] 「+12.87%(¥5,242)」形式で損益表示を実装 `src/components/AssetCard.tsx`
- [ ] T048 [US2] 損益テキストに損益色（緑/赤/グレー）を適用 `src/components/AssetCard.tsx`
- [ ] T049 [US2] チャートセグメント色に対応するカラーインジケーターバーを追加 `src/components/AssetCard.tsx`
- [ ] T050 [US2] 銘柄をAssetCardにマッピングするAssetListコンポーネントを作成 `src/components/AssetList.tsx`
- [ ] T051 [US2] AssetListがholding_ratio降順で描画されることを確認 `src/components/AssetList.tsx`
- [ ] T052 [US2] PortfolioChartの下にAssetListをpage.tsxに統合 `src/app/page.tsx`

**チェックポイント**: パイチャートの下に銘柄一覧が正しいフォーマットで表示される

---

## フェーズ5: ユーザーストーリー3 - 特定銘柄へのフォーカス (優先度: P3)

**ゴール**: 顧客が特定銘柄をクリック/タップしてフォーカスし、他を半透過表示にできる

**独立テスト**: パイチャートまたは銘柄カードをクリックすると選択銘柄がハイライトされ、他が半透過になる

### US3のテスト

- [ ] T053 [P] [US3] セグメントクリックハンドラのテストを作成 `src/components/PortfolioChart.test.tsx`
- [ ] T054 [P] [US3] フォーカス状態の透明度変更テストを作成 `src/components/PortfolioChart.test.tsx`
- [ ] T055 [P] [US3] カードクリックハンドラのテストを作成 `src/components/AssetCard.test.tsx`
- [ ] T056 [P] [US3] 半透過状態（opacity 0.3）のテストを作成 `src/components/AssetCard.test.tsx`

### US3の実装

- [ ] T057 [US3] page.tsxにfocusedIndex状態を追加 `src/app/page.tsx`
- [ ] T058 [US3] handleAssetClickハンドラを実装（同じ銘柄でトグル、別の銘柄でフォーカス設定） `src/app/page.tsx`
- [ ] T059 [US3] handleClearFocusハンドラを実装 `src/app/page.tsx`
- [ ] T060 [US3] PortfolioChartにfocusedIndexとonSegmentClickプロップを渡す `src/app/page.tsx`
- [ ] T061 [US3] PieセグメントのonClickハンドラを実装 `src/components/PortfolioChart.tsx`
- [ ] T062 [US3] focusedIndexに基づいてCellコンポーネントに透明度（1または0.3）を適用 `src/components/PortfolioChart.tsx`
- [ ] T063 [US3] 中央エリアクリックでフォーカス解除を実装（onClearFocus） `src/components/PortfolioChart.tsx`
- [ ] T064 [US3] AssetListにfocusedIndexとonAssetClickプロップを渡す `src/app/page.tsx`
- [ ] T065 [US3] 各AssetCardにisFocusedとisDimmedプロップを渡す `src/components/AssetList.tsx`
- [ ] T066 [US3] AssetCardにonClickハンドラを実装 `src/components/AssetCard.tsx`
- [ ] T067 [US3] isFocused/isDimmedプロップに基づいて透明度スタイルを適用 `src/components/AssetCard.tsx`
- [ ] T068 [US3] クリック可能要素にcursor-pointerとホバーエフェクトを追加 `src/components/PortfolioChart.tsx` と `src/components/AssetCard.tsx`

**チェックポイント**: パイチャートと銘柄一覧のフォーカス機能が連動して動作する

---

## フェーズ6: ユーザーストーリー4 - モバイルデバイスでの閲覧 (優先度: P2)

**ゴール**: 顧客がスマートフォン/タブレット/PCで快適にポートフォリオを閲覧できる

**独立テスト**: 各画面サイズ（< 640px, 640-1023px, >= 1024px）で適切なレイアウトが表示される

### US4の実装

- [ ] T069 [US4] page.tsxにレスポンシブコンテナスタイルを追加（max-width, padding） `src/app/page.tsx`
- [ ] T070 [US4] レスポンシブなチャートサイズを実装（モバイル280px、タブレット360px、デスクトップ400px） `src/components/PortfolioChart.tsx`
- [ ] T071 [US4] Recharts ResponsiveContainerを使用して適応的なチャート幅を実現 `src/components/PortfolioChart.tsx`
- [ ] T072 [US4] 中央ラベルにレスポンシブなタイポグラフィを適用（text-lg sm:text-xl lg:text-2xl） `src/components/PortfolioChart.tsx`
- [ ] T073 [US4] レスポンシブなカードレイアウトを適用（モバイルで全幅、全サイズで縦スタック） `src/components/AssetCard.tsx`
- [ ] T074 [US4] コンポーネント全体にレスポンシブな間隔を適用（gap, padding, margin）
- [ ] T075 [US4] モバイルアクセシビリティのためタッチターゲットを最低44x44pxに確保
- [ ] T076 [US4] ブラウザDevTools（Chrome）でレスポンシブ動作をテスト

**チェックポイント**: すべての画面サイズでレイアウトが適切に表示される

---

## フェーズ7: 仕上げ＆横断的関心事

**目的**: 最終改善と品質保証

- [ ] T077 [P] 空のポートフォリオエッジケースを処理（「保有銘柄がありません」メッセージを表示） `src/app/page.tsx`
- [ ] T078 [P] ロゴ画像読み込みエラー時のティッカーシンボルへのフォールバックを処理 `src/components/AssetCard.tsx`
- [ ] T079 [P] 小さい比率（< 0.1%）のセグメントに最小サイズを追加 `src/components/PortfolioChart.tsx`
- [ ] T080 `pnpm test:run` で全テストを実行し、100%パスを確認
- [ ] T081 `pnpm lint` でリンターを実行し、問題を修正
- [ ] T082 `pnpm format` でフォーマッターを実行し、フォーマットを確認
- [ ] T083 `pnpm build` で本番ビルドを実行し、成功を確認
- [ ] T084 手動テスト: Google Chrome最新版で全機能を確認
- [ ] T085 quickstart.md検証チェックリストを実行（6項目の動作確認）

---

## 依存関係と実行順序

### フェーズ依存関係

```
フェーズ1: セットアップ ────────────────────────────────────┐
                                                            │
フェーズ2: 基盤 ←──────────────────────────────────────────┘
    │
    ├──→ フェーズ3: ユーザーストーリー1 (P1) 🎯 MVP
    │         │
    │         └──→ フェーズ4: ユーザーストーリー2 (P2)
    │                   │
    │                   └──→ フェーズ5: ユーザーストーリー3 (P3)
    │                             │
    │                             └──→ フェーズ6: ユーザーストーリー4 (P2)
    │
    └──────────────────────────────────────→ フェーズ7: 仕上げ
```

### ユーザーストーリー依存関係

| ストーリー | 依存先 | 並列実行可能 |
|----------|--------|------------|
| US1 (P1) | フェーズ2 基盤 | - |
| US2 (P2) | US1（page.tsx構造が必要） | - |
| US3 (P3) | US1, US2（両コンポーネントが必要） | - |
| US4 (P2) | US1, US2, US3（全コンポーネントが必要） | - |

**注記**: このプロジェクトはコンポーネント統合要件により、ストーリー間に順次依存関係がある

### 各フェーズ内の実行順序

1. テストを最初に作成（含まれる場合）- 実装前にテストがFAILすることを確認
2. コアコンポーネントの実装
3. page.tsxへの統合
4. テストがPASSすることを確認

### 並列実行の機会

**フェーズ1（セットアップ）**:
```bash
# T001, T002完了後に並列実行可能:
T003, T004, T005, T006（すべて設定ファイル）
```

**フェーズ2（基盤）**:
```bash
# 並列実行可能:
T010, T011, T012, T013（型定義）
T015, T016, T017, T018, T019（ユーティリティ関数）
T021, T022（定数）
```

**フェーズ3（US1）**:
```bash
# テストは並列実行可能:
T024, T025, T026
```

**フェーズ4（US2）**:
```bash
# テストは並列実行可能:
T038, T039, T040, T041
```

---

## 実装戦略

### MVPファースト（ユーザーストーリー1のみ）

1. フェーズ1: セットアップを完了
2. フェーズ2: 基盤を完了
3. フェーズ3: ユーザーストーリー1を完了
4. **停止して検証**: パイチャートと中央ラベルが正しく表示される
5. MVPデプロイ/デモ準備完了

### インクリメンタルデリバリー

1. セットアップ + 基盤 → 基盤準備完了
2. ユーザーストーリー1追加 → テスト → パイチャート表示（MVP!）
3. ユーザーストーリー2追加 → テスト → 銘柄一覧表示
4. ユーザーストーリー3追加 → テスト → フォーカス機能
5. ユーザーストーリー4追加 → テスト → レスポンシブ対応
6. 仕上げ → 最終品質保証

### 推定タスク数

| フェーズ | タスク数 | 並列タスク |
|---------|---------|----------|
| フェーズ1: セットアップ | 9 | 4 |
| フェーズ2: 基盤 | 14 | 11 |
| フェーズ3: US1 | 14 | 3 |
| フェーズ4: US2 | 15 | 4 |
| フェーズ5: US3 | 16 | 4 |
| フェーズ6: US4 | 8 | 0 |
| フェーズ7: 仕上げ | 9 | 3 |
| **合計** | **85** | **29** |

---

## 注記

- [P] タスク = 別ファイル、依存なし
- [Story] ラベルはタスクを特定のユーザーストーリーに紐づけてトレーサビリティを確保
- 実装前にテストがFAILすることを確認
- 各タスクまたは論理グループの完了後にコミット
- 任意のチェックポイントで停止してストーリーを独立して検証可能
- すべてのファイルパスはリポジトリルートからの相対パス
- Rechartsを使用するコンポーネントには `'use client'` ディレクティブを使用
