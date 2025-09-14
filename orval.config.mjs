import { defineConfig } from 'orval';

export default defineConfig({
  freeeHR: {
    input: { target: './openapi/freee-hr.json' }, // 人事労務の OpenAPI
    output: {
      mode: 'single',           // MCP は single のみ
      client: 'mcp',            // これで MCP サーバーを生成
      // Use HR API base including '/hr' to hit the correct product API
      baseUrl: 'https://api.freee.co.jp/hr',
      target: 'src/handlers.ts',
      schemas: 'src/http-schemas',
      override: {
        // 認証や共通ヘッダー注入のためにカスタム fetch を差し込む
        mutator: { path: './src/custom-fetch.ts', name: 'customFetch' }
      }
    }
  }
});
