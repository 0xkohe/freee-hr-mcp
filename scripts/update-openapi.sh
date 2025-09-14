#!/usr/bin/env bash
set -euo pipefail

# Fetch the latest freee HR OpenAPI schema and update openapi/freee-hr.json

URL="https://raw.githubusercontent.com/freee/freee-api-schema/master/hr/open-api-3/api-schema.json"
TARGET_DIR="openapi"
TARGET_FILE="${TARGET_DIR}/freee-hr.json"

mkdir -p "${TARGET_DIR}"

TMP_FILE="$(mktemp)"
cleanup() { rm -f "${TMP_FILE}" >/dev/null 2>&1 || true; }
trap cleanup EXIT

echo "Downloading schema from: ${URL}" >&2

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${URL}" -o "${TMP_FILE}"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "${TMP_FILE}" "${URL}"
else
  echo "Error: neither curl nor wget is available." >&2
  exit 1
fi

# Validate JSON if jq is available
if command -v jq >/dev/null 2>&1; then
  if ! jq -e . < "${TMP_FILE}" >/dev/null; then
    echo "Error: downloaded content is not valid JSON." >&2
    exit 1
  fi
else
  echo "Warning: jq not found; skipping JSON validation." >&2
fi

# Atomically replace target
mv -f "${TMP_FILE}" "${TARGET_FILE}"
trap - EXIT
cleanup || true

bytes=$(wc -c < "${TARGET_FILE}" | tr -d ' ')
echo "Updated ${TARGET_FILE} (${bytes} bytes)."

