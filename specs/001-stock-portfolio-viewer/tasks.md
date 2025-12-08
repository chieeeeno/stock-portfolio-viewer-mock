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

- [x] T024 [P] [US1] PortfolioChartの描画コンポーネントテストを作成 `src/components/PortfolioChart.test.tsx`
- [x] T025 [P] [US1] チャート中央ラベル表示のテストを作成（総額、損益率、損益額） `src/components/PortfolioChart.test.tsx`
- [x] T026 [P] [US1] 損益色ロジックのテストを作成（緑/赤/グレー） `src/components/PortfolioChart.test.tsx`

### US1の実装

- [x] T027 [US1] 'use client'ディレクティブ付きでPortfolioChartコンポーネントの骨格を作成 `src/components/PortfolioChart.tsx`
- [x] T028 [US1] ドーナツ形状のRecharts PieChartを実装（innerRadius, outerRadius） `src/components/PortfolioChart.tsx`
- [x] T029 [US1] チャートを12時位置起点（startAngle={90}）で時計回り順に設定 `src/components/PortfolioChart.tsx`
- [x] T030 [US1] 資産総額を表示する中央ラベルを実装（¥115,500形式） `src/components/PortfolioChart.tsx`
- [x] T031 [US1] 評価損益を「+15.5%(¥15,500)」形式で表示する中央ラベルを実装 `src/components/PortfolioChart.tsx`
- [x] T032 [US1] 損益額に基づいて中央ラベルに損益色（緑/赤/グレー）を適用 `src/components/PortfolioChart.tsx`
- [x] T033 [US1] CHART_COLORS定数を使用してチャートセグメントの色を追加 `src/components/PortfolioChart.tsx`
- [x] T034 [US1] 描画前にholding_ratioの降順で銘柄をソート `src/components/PortfolioChart.tsx`
- [x] T035 [US1] モックデータを読み込みPortfolioChartを表示する基本的なpage.tsxを作成 `src/app/page.tsx`
- [x] T036 [US1] ローディング状態の処理を追加 `src/app/page.tsx`
- [x] T037 [US1] エラー状態の処理を追加 `src/app/page.tsx`

**チェックポイント**: パイチャートが正しく表示され、中央に資産総額と評価損益が表示される

---

## フェーズ4: ユーザーストーリー2 - 保有銘柄詳細情報の確認 (優先度: P2)

**ゴール**: 顧客がパイチャートの下で個別銘柄の詳細情報を確認できる

**独立テスト**: 銘柄一覧に各銘柄のロゴ、名前、ティッカー、比率、金額、評価損益が表示される

### US2のテスト

- [x] T038 [P] [US2] AssetCardの描画コンポーネントテストを作成 `src/components/AssetCard.test.tsx`
- [x] T039 [P] [US2] AssetListの描画コンポーネントテストを作成 `src/components/AssetList.test.tsx`
- [x] T040 [P] [US2] 「VOO / 39.8%」形式の表示テストを作成 `src/components/AssetCard.test.tsx`
- [x] T041 [P] [US2] 「+12.87%(¥5,242)」形式の損益表示テストを作成 `src/components/AssetCard.test.tsx`

### US2の実装

- [x] T042 [US2] AssetCardコンポーネントの骨格を作成 `src/components/AssetCard.tsx`
- [x] T043 [US2] next/imageでロゴ画像表示を実装、エラー時はティッカーシンボルにフォールバック `src/components/AssetCard.tsx`
- [x] T044 [US2] 銘柄名の表示を実装 `src/components/AssetCard.tsx`
- [x] T045 [US2] 「VOO / 39.8%」形式でティッカー/比率の表示を実装 `src/components/AssetCard.tsx`
- [x] T046 [US2] 保有金額の表示を実装（¥45,969形式） `src/components/AssetCard.tsx`
- [x] T047 [US2] 「+12.87%(¥5,242)」形式で損益表示を実装 `src/components/AssetCard.tsx`
- [x] T048 [US2] 損益テキストに損益色（緑/赤/グレー）を適用 `src/components/AssetCard.tsx`
- [x] T049 [US2] チャートセグメント色に対応するカラーインジケーターバーを追加 `src/components/AssetCard.tsx`
- [x] T050 [US2] 銘柄をAssetCardにマッピングするAssetListコンポーネントを作成 `src/components/AssetList.tsx`
- [x] T051 [US2] AssetListがholding_ratio降順で描画されることを確認 `src/components/AssetList.tsx`
- [x] T052 [US2] PortfolioChartの下にAssetListをpage.tsxに統合 `src/app/page.tsx`

**チェックポイント**: パイチャートの下に銘柄一覧が正しいフォーマットで表示される

---

## フェーズ5: ユーザーストーリー3 - 特定銘柄へのフォーカス (優先度: P3)

**ゴール**: 顧客が特定銘柄をクリック/タップしてフォーカスし、他を半透過表示にできる

**独立テスト**: パイチャートまたは銘柄カードをクリックすると選択銘柄がハイライトされ、他が半透過になる

### US3のテスト

- [x] T053 [P] [US3] セグメントクリックハンドラのテストを作成 `src/components/PortfolioChart.test.tsx`
- [x] T054 [P] [US3] フォーカス状態の透明度変更テストを作成 `src/components/PortfolioChart.test.tsx`
- [x] T055 [P] [US3] カードクリックハンドラのテストを作成 `src/components/AssetCard.test.tsx`
- [x] T056 [P] [US3] 半透過状態（opacity 0.3）のテストを作成 `src/components/AssetCard.test.tsx`

### US3の実装

- [x] T057 [US3] page.tsxにfocusedIndex状態を追加 `src/app/page.tsx`
- [x] T058 [US3] handleAssetClickハンドラを実装（同じ銘柄でトグル、別の銘柄でフォーカス設定） `src/app/page.tsx`
- [x] T059 [US3] handleClearFocusハンドラを実装 `src/app/page.tsx`
- [x] T060 [US3] PortfolioChartにfocusedIndexとonSegmentClickプロップを渡す `src/app/page.tsx`
- [x] T061 [US3] PieセグメントのonClickハンドラを実装 `src/components/PortfolioChart.tsx`
- [x] T062 [US3] focusedIndexに基づいてCellコンポーネントに透明度（1または0.3）を適用 `src/components/PortfolioChart.tsx`
- [x] T063 [US3] 中央エリアクリックでフォーカス解除を実装（onClearFocus） `src/components/PortfolioChart.tsx`
- [x] T064 [US3] AssetListにfocusedIndexとonAssetClickプロップを渡す `src/app/page.tsx`
- [x] T065 [US3] 各AssetCardにisFocusedとisDimmedプロップを渡す `src/components/AssetList.tsx`
- [x] T066 [US3] AssetCardにonClickハンドラを実装 `src/components/AssetCard.tsx`
- [x] T067 [US3] isFocused/isDimmedプロップに基づいて透明度スタイルを適用 `src/components/AssetCard.tsx`
- [x] T068 [US3] クリック可能要素にcursor-pointerとホバーエフェクトを追加 `src/components/PortfolioChart.tsx` と `src/components/AssetCard.tsx`

**チェックポイント**: パイチャートと銘柄一覧のフォーカス機能が連動して動作する

---

## フェーズ5.5: ユーザーストーリー3A - データローディング時のスケルトン表示 (優先度: P2)

**ゴール**: 顧客がデータ読み込み中でも待ち時間を快適に過ごせるよう、スケルトンスクリーンを表示する

**独立テスト**: ページ読み込み時またはデータ取得中に、スケルトンスクリーンが表示される

### US3Aのテスト

- [x] T068A [P] [US3A] PortfolioChartSkeletonの描画テストを作成 `src/app/_components/PortfolioChartSkeleton.test.tsx`
- [x] T068B [P] [US3A] AssetCardSkeletonの描画テストを作成 `src/app/_components/AssetCardSkeleton.test.tsx`
- [x] T068C [P] [US3A] スケルトンアニメーションクラスのテストを作成 `src/app/_components/PortfolioChartSkeleton.test.tsx`

### US3Aの実装

- [x] T068D [US3A] PortfolioChartSkeletonコンポーネントの骨格を作成 `src/app/_components/PortfolioChartSkeleton.tsx`
- [x] T068E [US3A] ドーナツ形状のスケルトンプレースホルダーを実装 `src/app/_components/PortfolioChartSkeleton.tsx`
- [x] T068F [US3A] 中央ラベルエリアのスケルトンプレースホルダーを実装 `src/app/_components/PortfolioChartSkeleton.tsx`
- [x] T068G [US3A] AssetCardSkeletonコンポーネントの骨格を作成 `src/app/_components/AssetCardSkeleton.tsx`
- [x] T068H [US3A] カード形状のスケルトンプレースホルダーを実装（ロゴ、テキスト行） `src/app/_components/AssetCardSkeleton.tsx`
- [x] T068I [US3A] AssetListSkeletonコンポーネントを作成（複数のAssetCardSkeletonを表示） `src/app/_components/AssetListSkeleton.tsx`
- [x] T068J [US3A] スケルトン要素にパルスアニメーションを適用（Tailwind animate-pulse） `src/app/_components/PortfolioChartSkeleton.tsx` と `src/app/_components/AssetCardSkeleton.tsx`
- [x] T068K [US3A] page.tsxのローディング状態でスケルトンコンポーネントを表示 `src/app/page.tsx`
- [x] T068L [US3A] スケルトンからコンテンツへのスムーズな遷移を確認

**チェックポイント**: データ読み込み中にスケルトンスクリーンが表示され、読み込み完了後にコンテンツが表示される

---

## フェーズ6: ユーザーストーリー4 - モバイルデバイスでの閲覧 (優先度: P2)

**ゴール**: 顧客がスマートフォン/タブレット/PCで快適にポートフォリオを閲覧できる

**独立テスト**: 各画面サイズ（< 640px, 640-1023px, >= 1024px）で適切なレイアウトが表示される

### US4の実装

- [x] T069 [US4] page.tsxにレスポンシブコンテナスタイルを追加（max-width, padding） `src/app/page.tsx`
- [x] T070 [US4] レスポンシブなチャートサイズを実装（モバイル280px、タブレット360px、デスクトップ400px） `src/components/PortfolioChart.tsx`
- [x] T071 [US4] Recharts ResponsiveContainerを使用して適応的なチャート幅を実現 `src/components/PortfolioChart.tsx`
- [x] T072 [US4] 中央ラベルにレスポンシブなタイポグラフィを適用（text-lg sm:text-xl lg:text-2xl） `src/components/PortfolioChart.tsx`
- [x] T073 [US4] レスポンシブなカードレイアウトを適用（モバイルで全幅、全サイズで縦スタック） `src/components/AssetCard.tsx`
- [x] T074 [US4] コンポーネント全体にレスポンシブな間隔を適用（gap, padding, margin）
- [x] T075 [US4] モバイルアクセシビリティのためタッチターゲットを最低44x44pxに確保
- [x] T076 [US4] ブラウザDevTools（Chrome）でレスポンシブ動作をテスト

**チェックポイント**: すべての画面サイズでレイアウトが適切に表示される

---

## フェーズ7: ユーザーストーリー5 - チャートホバーによる詳細情報の確認 (優先度: P3)

**ゴール**: 顧客がパイチャートセグメントにホバーして銘柄詳細をツールチップで確認できる

**独立テスト**: セグメントにマウスを乗せるとツールチップが表示され、外すと非表示になる

### US5のテスト

- [ ] T086 [P] [US5] ツールチップ表示のコンポーネントテストを作成 `src/components/PortfolioChart.test.tsx`
- [ ] T087 [P] [US5] ツールチップに銘柄名、保有金額、保有比率が表示されることをテスト `src/components/PortfolioChart.test.tsx`

### US5の実装

- [ ] T088 [US5] カスタムツールチップコンポーネントを作成 `src/components/ChartTooltip.tsx`
- [ ] T089 [US5] ツールチップに銘柄名を表示 `src/components/ChartTooltip.tsx`
- [ ] T090 [US5] ツールチップに保有金額（¥形式）を表示 `src/components/ChartTooltip.tsx`
- [ ] T091 [US5] ツールチップに保有比率（%形式）を表示 `src/components/ChartTooltip.tsx`
- [ ] T092 [US5] ツールチップのスタイリング（背景、影、角丸） `src/components/ChartTooltip.tsx`
- [ ] T093 [US5] RechartsのTooltipコンポーネントにカスタムツールチップを統合 `src/components/PortfolioChart.tsx`
- [ ] T094 [US5] タッチデバイスでのツールチップ表示対応（タップで表示） `src/components/PortfolioChart.tsx`

**チェックポイント**: パイチャートセグメントにホバー/タップで詳細情報が表示される

---

## フェーズ8: ユーザーストーリー6 - ダークモードでの閲覧 (優先度: P3)

**ゴール**: 顧客がグローバルヘッダーのテーマ切り替えスイッチを使用してダークモード/ライトモードを切り替え、ポートフォリオを快適に閲覧できる

**独立テスト**: ヘッダーのテーマ切り替えスイッチをクリックするとアプリ全体のテーマが切り替わる

### US6のテスト

- [ ] T095 [P] [US6] ThemeToggleコンポーネントのテストを作成 `src/components/ThemeToggle.test.tsx`
- [ ] T096 [P] [US6] Headerコンポーネントの描画テストを作成 `src/components/Header.test.tsx`
- [ ] T097 [P] [US6] useThemeフックのテストを作成 `src/hooks/useTheme.test.ts`
- [ ] T098 [P] [US6] ダークモードでの損益色（緑/赤/グレー）表示テストを作成 `src/components/PortfolioChart.test.tsx`

### US6の実装

- [ ] T099 [US6] Tailwind CSSのdarkModeを'class'に設定（手動切り替え対応） `tailwind.config.ts`
- [ ] T100 [US6] useThemeカスタムフックを作成（localStorage保存、システム設定フォールバック） `src/hooks/useTheme.ts`
- [ ] T101 [US6] ThemeToggleコンポーネントの骨格を作成 `src/components/ThemeToggle.tsx`
- [ ] T102 [US6] ThemeToggleにトグルボタンUIを実装（太陽/月アイコン） `src/components/ThemeToggle.tsx`
- [ ] T103 [US6] Headerコンポーネントの骨格を作成 `src/components/Header.tsx`
- [ ] T104 [US6] HeaderにThemeToggleを配置 `src/components/Header.tsx`
- [ ] T105 [US6] Headerにレスポンシブスタイルを適用 `src/components/Header.tsx`
- [ ] T106 [US6] layout.tsxにHeaderを統合 `src/app/layout.tsx`
- [ ] T107 [US6] layout.tsxにテーマ初期化スクリプトを追加（FOUC防止） `src/app/layout.tsx`
- [ ] T108 [US6] globals.cssにダークモード用CSS変数を定義 `src/app/globals.css`
- [ ] T109 [US6] PortfolioChartにダークモード対応スタイルを追加 `src/components/PortfolioChart.tsx`
- [ ] T110 [US6] ChartTooltipにダークモード対応スタイルを追加 `src/components/ChartTooltip.tsx`
- [ ] T111 [US6] AssetCardにダークモード対応スタイルを追加 `src/components/AssetCard.tsx`
- [ ] T112 [US6] AssetListにダークモード対応スタイルを追加 `src/components/AssetList.tsx`
- [ ] T113 [US6] GAIN_COLORSにダークモード用カラーを追加 `src/utils/constants.ts`
- [ ] T114 [US6] ダークモードでのチャートセグメント色の視認性を確認・調整 `src/utils/constants.ts`
- [ ] T115 [US6] 手動テスト: テーマ切り替えスイッチで全コンポーネントのテーマ切り替えを確認
- [ ] T116 [US6] 手動テスト: ページリロード後もテーマ設定が維持されることを確認

**チェックポイント**: ヘッダーのテーマ切り替えスイッチでダークモード/ライトモードが切り替わり、設定が永続化される

---

## フェーズ9: 仕上げ＆横断的関心事

**目的**: 最終改善と品質保証

- [ ] T117 [P] 空のポートフォリオエッジケースを処理（「保有銘柄がありません」メッセージを表示） `src/app/page.tsx`
- [ ] T118 [P] ロゴ画像読み込みエラー時のティッカーシンボルへのフォールバックを処理 `src/components/AssetCard.tsx`
- [ ] T119 [P] 小さい比率（< 0.1%）のセグメントに最小サイズを追加 `src/components/PortfolioChart.tsx`
- [ ] T120 `pnpm test:run` で全テストを実行し、100%パスを確認
- [ ] T121 `pnpm lint` でリンターを実行し、問題を修正
- [ ] T122 `pnpm format` でフォーマッターを実行し、フォーマットを確認
- [ ] T123 `pnpm build` で本番ビルドを実行し、成功を確認
- [ ] T124 手動テスト: Google Chrome最新版で全機能を確認
- [ ] T125 quickstart.md検証チェックリストを実行（6項目の動作確認）

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
    │                             └──→ フェーズ5.5: ユーザーストーリー3A (P2) ← スケルトンスクリーン
    │                                       │
    │                                       └──→ フェーズ6: ユーザーストーリー4 (P2)
    │                                                 │
    │                                                 ├──→ フェーズ7: ユーザーストーリー5 (P3)
    │                                                 │
    │                                                 └──→ フェーズ8: ユーザーストーリー6 (P3)
    │
    └──────────────────────────────────────────→ フェーズ9: 仕上げ
```

### ユーザーストーリー依存関係

| ストーリー | 依存先 | 並列実行可能 |
|----------|--------|------------|
| US1 (P1) | フェーズ2 基盤 | - |
| US2 (P2) | US1（page.tsx構造が必要） | - |
| US3 (P3) | US1, US2（両コンポーネントが必要） | - |
| US3A (P2) | US1, US2（スケルトンは既存コンポーネントの形状を模倣） | - |
| US4 (P2) | US1, US2, US3, US3A（全コンポーネントが必要） | - |
| US5 (P3) | US1（PortfolioChartが必要） | US6と並列可能 |
| US6 (P3) | US1, US2（全コンポーネントが必要） | US5と並列可能 |

**注記**: このプロジェクトはコンポーネント統合要件により、ストーリー間に順次依存関係がある。ただしUS5とUS6は互いに独立しており並列実行可能

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

**フェーズ5.5（US3A）**:
```bash
# テストは並列実行可能:
T068A, T068B, T068C
```

**フェーズ7（US5）**:
```bash
# テストは並列実行可能:
T086, T087
```

**フェーズ8（US6）**:
```bash
# テストは並列実行可能:
T095, T096
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
5. ユーザーストーリー3A追加 → テスト → スケルトンスクリーン表示
6. ユーザーストーリー4追加 → テスト → レスポンシブ対応
7. ユーザーストーリー5追加 → テスト → ツールチップ表示
8. ユーザーストーリー6追加 → テスト → ダークモード対応
9. 仕上げ → 最終品質保証

### 推定タスク数

| フェーズ | タスク数 | 並列タスク |
|---------|---------|----------|
| フェーズ1: セットアップ | 9 | 4 |
| フェーズ2: 基盤 | 14 | 11 |
| フェーズ3: US1 | 14 | 3 |
| フェーズ4: US2 | 15 | 4 |
| フェーズ5: US3 | 16 | 4 |
| フェーズ5.5: US3A | 12 | 3 |
| フェーズ6: US4 | 8 | 0 |
| フェーズ7: US5 | 9 | 2 |
| フェーズ8: US6 | 22 | 4 |
| フェーズ9: 仕上げ | 9 | 3 |
| **合計** | **128** | **38** |

---

## 注記

- [P] タスク = 別ファイル、依存なし
- [Story] ラベルはタスクを特定のユーザーストーリーに紐づけてトレーサビリティを確保
- 実装前にテストがFAILすることを確認
- 各タスクまたは論理グループの完了後にコミット
- 任意のチェックポイントで停止してストーリーを独立して検証可能
- すべてのファイルパスはリポジトリルートからの相対パス
- Rechartsを使用するコンポーネントには `'use client'` ディレクティブを使用
