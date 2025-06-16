# Google 日本語優先検索 Chrome 拡張機能 - アーキテクチャ設計

## 概要

Google 検索時に検索ワードに漢字が含まれている場合、自動的に日本語の検索結果を優先表示するための Chrome 拡張機能。

## 機能要件

- 検索ワードに漢字が 1 文字でも含まれていれば `lr=lang_ja` パラメータを追加
- 既存の `lr` パラメータがある場合は上書き
- 対象ドメイン: google.com, google.co.jp など全ての Google ドメイン

## 技術設計

### 1. ファイル構成

```
google-jp-search/
├── manifest.json       # 拡張機能の設定ファイル
├── content.js         # コンテンツスクリプト（メインロジック）
└── icons/             # アイコンファイル（オプション）
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### 2. manifest.json

- **Manifest Version**: 3（最新版）
- **権限**:
  - `activeTab`: 現在のタブでの動作
  - Google 関連ドメインへのアクセス権限
- **コンテンツスクリプト設定**:
  - 対象 URL: `https://*.google.com/*`, `https://*.google.co.jp/*` など
  - 実行タイミング: `document_start`（早期実行）

### 3. content.js - メインロジック

#### 3.1 漢字検出関数

```javascript
function containsKanji(text) {
  // Unicode範囲: 一般的な漢字 (CJK統合漢字)
  // U+4E00-U+9FFF: CJK統合漢字
  // U+3400-U+4DBF: CJK統合漢字拡張A
  const kanjiRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/;
  return kanjiRegex.test(text);
}
```

#### 3.2 検索ワード取得

- URL から検索クエリパラメータ `q` を取得
- URLSearchParams を使用してパラメータを解析

#### 3.3 URL 書き換えロジック

1. 現在の URL を解析
2. 検索ワード（`q`パラメータ）を取得
3. 漢字が含まれているかチェック
4. 含まれている場合:
   - `lr=lang_ja` を追加または更新
   - 新しい URL にリダイレクト

### 4. 実装の流れ

1. ページロード時にコンテンツスクリプトが実行
2. 現在の URL が Google 検索結果ページかチェック
3. 検索ワードに漢字が含まれているか確認
4. 必要に応じて URL パラメータを更新してリダイレクト

### 5. エッジケース対応

- 既に `lr=lang_ja` が設定されている場合は何もしない
- 他の `lr` パラメータが設定されている場合は上書き
- 無限リダイレクトを防ぐためのフラグ管理

### 6. パフォーマンス考慮

- 早期実行（`document_start`）により素早い処理
- 正規表現は事前にコンパイル
- 不要な処理を避けるための条件分岐

## セキュリティ考慮事項

- 最小限の権限のみ要求
- XSS 対策として DOM 操作は最小限に
- ユーザーデータの収集は行わない
