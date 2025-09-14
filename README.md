# Freee HR MCP Server

freee人事労務APIをModel Context Protocol (MCP)経由で利用するためのサーバー実装です。

## 概要

このMCPサーバーは、freee人事労務のAPIをClaude Desktop等のMCP対応クライアントから利用できるようにします。OpenAPIスペックからOrvalを使用して自動生成されたコードをベースに構築されています。

## 主な機能

- **従業員管理**: 従業員情報の取得、作成、更新、削除
- **勤怠管理**: 打刻、勤怠記録の取得・更新
- **休暇管理**: 有給休暇、特別休暇の管理
- **申請承認**: 各種申請の作成、承認
- **グループ管理**: グループの作成、メンバー管理
- **給与明細**: 給与明細の取得

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

以下の環境変数を設定してください：

```bash
export FREEE_HR_ACCESS_TOKEN="your_access_token_here"
export FREEE_HR_COMPANY_ID="your_company_id_here"
```

#### アクセストークンの取得方法

1. [freee開発者サイト](https://developer.freee.co.jp/)にアクセス
2. アプリケーションを作成
3. OAuth2.0認証フローでアクセストークンを取得

#### Company IDの取得方法

アクセストークン取得後、以下のコマンドで確認できます：

```bash
curl -X GET "https://api.freee.co.jp/hr/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. ビルド

```bash
npm run build
```

### 4. MCPサーバーの起動

```bash
npm start
```

## Claude Desktopでの設定

`claude_desktop_config.json`に以下を追加：

```json
{
  "mcpServers": {
    "freee-hr": {
      "command": "node",
      "args": ["/path/to/freee-hr-mcp/dist/server.js"],
      "env": {
        "FREEE_HR_ACCESS_TOKEN": "your_access_token_here",
        "FREEE_HR_COMPANY_ID": "your_company_id_here"
      }
    }
  }
}
```

## VSCode + GitHub Copilotでの設定

### 1. 必要な拡張機能のインストール

VSCode拡張機能マーケットプレイスから以下をインストール：
- GitHub Copilot
- GitHub Copilot Chat

### 2. MCPサーバーの設定

プロジェクトのルートディレクトリに`.vscode/settings.json`を作成し、以下を追加：

```json
{
  "github.copilot.chat.mcpServers": {
    "servers": {
      "freee-hr-mcp": {
        "type": "stdio",
        "command": "node",
        "args": ["dist/server.js"],
        "env": {
          "FREEE_HR_ACCESS_TOKEN": "${input:FREEE_HR_ACCESS_TOKEN}",
          "FREEE_HR_COMPANY_ID": "${input:FREEE_HR_COMPANY_ID}"
        }
      }
    },
    "inputs": [
      {
        "id": "FREEE_HR_ACCESS_TOKEN",
        "type": "promptString",
        "description": "freee access token"
      },
      {
        "id": "FREEE_HR_COMPANY_ID",
        "type": "promptString",
        "description": "freee company_id"
      }
    ]
  }
}
```

この設定により、MCPサーバー起動時に認証情報の入力を求められるため、セキュアに利用できます。

### 3. 使用方法

1. VSCodeでCopilot Chatパネルを開く（`Cmd/Ctrl + Shift + I`）
2. チャットに `@mcp` と入力してMCPモードを有効化
3. 初回接続時に認証情報の入力プロンプトが表示される
4. freee人事労務の操作を依頼

### VSCode Copilotでの使用例

```
// Copilot Chatでの使用例
@mcp freeeで従業員一覧を取得してください

@mcp 今月の勤怠データを確認して、残業時間が多い従業員をリストアップして

@mcp 有給休暇の残日数を全従業員分取得してCSV形式で出力して
```

### 環境変数を使用した設定（オプション）

環境変数から認証情報を読み込む場合は、以下の設定を使用：

```json
{
  "github.copilot.chat.mcpServers": {
    "servers": {
      "freee-hr-mcp": {
        "type": "stdio",
        "command": "node",
        "args": ["dist/server.js"],
        "env": {
          "FREEE_HR_ACCESS_TOKEN": "${env:FREEE_HR_ACCESS_TOKEN}",
          "FREEE_HR_COMPANY_ID": "${env:FREEE_HR_COMPANY_ID}"
        }
      }
    }
  }
}
```

この場合、事前に環境変数を設定しておく必要があります：

```bash
export FREEE_HR_ACCESS_TOKEN="your_access_token"
export FREEE_HR_COMPANY_ID="your_company_id"
```

## 使用例

Claude Desktopで以下のような操作が可能です：

### 従業員一覧の取得
```
「従業員の一覧を取得してください」
```

### 勤怠打刻
```
「出勤打刻をしてください」
```

### 勤怠記録の確認
```
「今月の勤怠記録を表示してください」
```

### 有給休暇の申請
```
「明日から2日間の有給休暇を申請してください」
```

## 開発者向け情報

### 最新のfreee HR APIに更新する手順

freee APIが更新された場合、以下の手順で最新版に対応できます：

#### 1. 一括更新（推奨）

```bash
# 最新のAPIスキーマ取得とコード生成を一括実行
npm run update-and-generate

# TypeScriptをビルド
npm run build

# 動作確認
npm start
```

#### 2. 段階的な更新（デバッグ時）

```bash
# Step 1: 最新のOpenAPIスキーマを取得
npm run update-schema

# Step 2: コードを生成
npm run generate

# Step 3: ビルド
npm run build

# Step 4: 動作確認
npm start
```

### OpenAPIスキーマの更新

freeeの最新APIスキーマを取得：

```bash
npm run update-schema
```

このコマンドは、freeeの公式GitHubリポジトリから最新のOpenAPIスキーマをダウンロードします。

### コード生成

OpenAPIスペックから最新のコードを生成：

```bash
npm run generate
```

このコマンドは以下を実行します：
1. Orvalによるコード生成
2. post-generateスクリプトの実行
3. datetime修正スクリプトの実行（`.datetime()`呼び出しの自動削除）

### スキーマ更新とコード生成を一括実行

最新のAPIスキーマを取得してコードを再生成：

```bash
npm run update-and-generate
```

このコマンドは以下を順番に実行します：
1. 最新のOpenAPIスキーマをダウンロード
2. Orvalでコードを生成
3. 生成後の処理を実行

### プロジェクト構造

```
freee-mcp2/
├── src/
│   ├── server.ts          # MCPサーバーのエントリーポイント
│   ├── handlers.ts        # 自動生成されたハンドラー
│   ├── http-client.ts     # 自動生成されたHTTPクライアント
│   ├── tool-schemas.zod.ts # 自動生成されたZodスキーマ
│   ├── custom-fetch.ts    # カスタムfetch実装（認証等）
│   └── http-schemas/      # 自動生成された型定義
├── openapi/
│   └── freee-hr.json      # freee人事労務のOpenAPIスペック
├── scripts/
│   ├── post-generate.js   # 生成後の処理スクリプト
│   └── update-openapi-schema.sh # OpenAPIスキーマ更新スクリプト
├── fix-datetime.js        # datetime修正スクリプト
└── orval.config.mjs       # Orval設定ファイル
```

### トラブルシューティング

#### 環境変数エラー
```
Error: FREEE_HR_ACCESS_TOKEN environment variable is required
```
→ 環境変数が正しく設定されているか確認してください。

#### 認証エラー（401）
```
Status: 401 Unauthorized
```
→ アクセストークンの有効期限を確認してください。

#### datetime関連のエラー
```
Invalid datetime string
```
→ `npm run generate`を実行して、datetime修正が適用されているか確認してください。

### 既知の問題と対処法

1. **POST/PUTリクエストのボディが送信されない**
   - `custom-fetch.ts`で`body`フィールドを`data`フィールドに変換して対応

2. **datetime()によるタイムゾーン付き日時の検証エラー**
   - `fix-datetime.js`で自動的に`.datetime()`を削除して対応


## サポート

問題が発生した場合は、Issueを作成してください。
