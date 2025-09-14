#!/bin/bash

# Script to download the latest freee HR API schema from GitHub
# This ensures we're always working with the most up-to-date API specification

echo "Downloading latest freee HR API schema..."

# Create openapi directory if it doesn't exist
mkdir -p openapi

# Download the schema file
curl -L -o openapi/freee-hr.json \
  https://raw.githubusercontent.com/freee/freee-api-schema/master/hr/open-api-3/api-schema.json

# Check if download was successful
if [ $? -eq 0 ]; then
  echo "✅ Successfully downloaded freee HR API schema to openapi/freee-hr.json"

  # Pretty print the JSON for better readability
  if command -v jq &> /dev/null; then
    echo "Formatting JSON with jq..."
    jq '.' openapi/freee-hr.json > openapi/freee-hr.tmp.json && \
    mv openapi/freee-hr.tmp.json openapi/freee-hr.json
    echo "✅ JSON formatted successfully"
  else
    echo "ℹ️  jq not installed. Skipping JSON formatting."
    echo "   Install jq for prettier JSON output: brew install jq (macOS) or apt-get install jq (Linux)"
  fi
else
  echo "❌ Failed to download freee HR API schema"
  exit 1
fi

echo "Done! You can now run 'npm run generate' to generate the latest code."