# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server implementation for freee HR API (人事労務). The codebase is auto-generated from OpenAPI specifications using Orval, with custom modifications to handle authentication and data transformation.

## Essential Commands

### Development
```bash
npm run dev                    # Run MCP server in development mode with ts-node
npm run build                  # Build TypeScript to JavaScript
npm start                      # Run the built MCP server
```

### Code Generation (CRITICAL - Read Before Modifying)
```bash
npm run update-schema          # Download latest OpenAPI spec from freee GitHub
npm run generate              # Generate code from OpenAPI spec (runs Orval + post-processing)
npm run update-and-generate   # Update schema and regenerate code in one command
```

**WARNING**: Most files in `src/` are auto-generated. Manual changes to the following files will be LOST on regeneration:
- `src/handlers.ts`
- `src/http-client.ts`
- `src/tool-schemas.zod.ts`
- `src/http-schemas/`

Only modify:
- `src/custom-fetch.ts` - Custom authentication and request handling
- `scripts/post-generate.js` - Post-generation processing
- `fix-datetime.js` - Removes `.datetime()` from Zod schemas to fix timezone validation issues

## Architecture

### Code Generation Pipeline
1. **OpenAPI Schema** (`openapi/freee-hr.json`) →
2. **Orval** (configured in `orval.config.mjs`) generates MCP handlers →
3. **Post-processing scripts** fix generation issues:
   - `scripts/post-generate.js` - General fixes
   - `fix-datetime.js` - Removes `.datetime()` calls that break timezone validation

### Request Flow
1. MCP client sends tool request →
2. `src/server.ts` (auto-generated MCP server) →
3. Handler functions in `src/handlers.ts` →
4. HTTP client in `src/http-client.ts` →
5. **`src/custom-fetch.ts`** (CRITICAL - handles auth and request transformation) →
6. freee API

### Key Customizations

#### Authentication (`src/custom-fetch.ts`)
- Injects `FREEE_HR_ACCESS_TOKEN` and `FREEE_HR_COMPANY_ID` from environment
- Converts `body` field to `data` field for Axios compatibility
- Handles undefined path parameters
- Adds detailed request/response logging

#### Known Issues and Fixes
1. **POST/PUT body not sent**: Fixed in `custom-fetch.ts` by converting `body` to `data`
2. **Datetime validation errors**: Fixed by `fix-datetime.js` removing `.datetime()` from Zod schemas
3. **Company ID undefined**: Auto-replaced with env variable in `custom-fetch.ts`

## Environment Variables Required

```bash
export FREEE_HR_ACCESS_TOKEN="your_token"  # Required: OAuth2 access token
export FREEE_HR_COMPANY_ID="your_id"      # Required: Company ID from freee
```

## Testing Changes

When testing API calls:
1. Check console output for detailed request/response logs (implemented in `custom-fetch.ts`)
2. Look for "MCP Request Details" and "MCP Response Details" sections
3. Verify the Request Body is present for POST/PUT operations

## Regenerating Code After API Changes

If freee updates their API:
```bash
npm run update-and-generate  # Downloads latest spec and regenerates everything
npm run build                 # Rebuild TypeScript
npm start                     # Test the server
```