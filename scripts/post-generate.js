#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Running post-generate fixes...');

// Fix handlers.ts - replace parameter names
const handlersPath = path.join(__dirname, '../src/handlers.ts');
if (fs.existsSync(handlersPath)) {
  let handlersContent = fs.readFileSync(handlersPath, 'utf8');

  // Replace employeeId with employee_id
  handlersContent = handlersContent.replace(/args\.pathParams\.employeeId/g, 'args.pathParams.employee_id');
  // Replace companyId with company_id
  handlersContent = handlersContent.replace(/args\.pathParams\.companyId/g, 'args.pathParams.company_id');

  fs.writeFileSync(handlersPath, handlersContent);
  console.log('✅ Fixed parameter names in handlers.ts');
}

// Fix http-client.ts - add customFetch import
const httpClientPath = path.join(__dirname, '../src/http-client.ts');
if (fs.existsSync(httpClientPath)) {
  let httpClientContent = fs.readFileSync(httpClientPath, 'utf8');

  // Check if customFetch import already exists
  if (!httpClientContent.includes("import { customFetch } from './custom-fetch';")) {
    // Find the last import line and add customFetch import after it
    const lastImportMatch = httpClientContent.match(/^.*from\s+['"]\.\/http-schemas['"];?\s*$/m);
    if (lastImportMatch) {
      const insertPosition = lastImportMatch.index + lastImportMatch[0].length;
      httpClientContent =
        httpClientContent.slice(0, insertPosition) +
        "\nimport { customFetch } from './custom-fetch';" +
        httpClientContent.slice(insertPosition);

      fs.writeFileSync(httpClientPath, httpClientContent);
      console.log('✅ Added customFetch import to http-client.ts');
    }
  }
}

// Fix server.ts - add logging message
const serverPath = path.join(__dirname, '../src/server.ts');
if (fs.existsSync(serverPath)) {
  let serverContent = fs.readFileSync(serverPath, 'utf8');

  // Add logging message if not present
  if (!serverContent.includes('Request logging is enabled for all API calls')) {
    serverContent = serverContent.replace(
      /console\.error\('MCP server running on stdio'\);/,
      "console.error('MCP server running on stdio');\n  console.error('Request logging is enabled for all API calls');"
    );

    fs.writeFileSync(serverPath, serverContent);
    console.log('✅ Added logging message to server.ts');
  }
}

console.log('Post-generate fixes completed!');