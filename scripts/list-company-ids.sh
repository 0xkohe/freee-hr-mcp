#!/usr/bin/env bash
set -euo pipefail

# List company_id values available to the current token.
#
# Usage:
#   FREEE_HR_ACCESS_TOKEN=xxxxx scripts/list-company-ids.sh [--json | --tsv | --with-name]
#   scripts/list-company-ids.sh --help
#
# Defaults to printing company_id one per line. Requires curl and jq.

print_help() {
  cat <<'USAGE'
List company_id values available to the current token.

Env:
  FREEE_HR_ACCESS_TOKEN   OAuth2 Bearer token (required)

Options:
  --json        Output JSON array of {id, name, role}
  --tsv         Output tab-separated: id<TAB>name<TAB>role
  --with-name   Output: id<TAB>name (alias for a concise TSV)
  --help        Show this help

Examples:
  FREEE_HR_ACCESS_TOKEN=xxxx scripts/list-company-ids.sh
  FREEE_HR_ACCESS_TOKEN=xxxx scripts/list-company-ids.sh --json
  FREEE_HR_ACCESS_TOKEN=xxxx scripts/list-company-ids.sh --with-name
USAGE
}

FORMAT="ids" # ids | json | tsv | with-name

for arg in "$@"; do
  case "$arg" in
    --help|-h) print_help; exit 0 ;;
    --json) FORMAT="json" ;;
    --tsv) FORMAT="tsv" ;;
    --with-name) FORMAT="with-name" ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required to parse API responses." >&2
  exit 1
fi

TOKEN=${FREEE_HR_ACCESS_TOKEN:-}
if [[ -z "${TOKEN}" ]]; then
  echo "Error: FREEE_HR_ACCESS_TOKEN is not set." >&2
  exit 1
fi

URL="https://api.freee.co.jp/hr/api/v1/users/me"

TMP="$(mktemp)"
cleanup() { rm -f "$TMP" >/dev/null 2>&1 || true; }
trap cleanup EXIT

HTTP_CODE=$(curl -sS -o "$TMP" -w "%{http_code}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/json" \
  "$URL")

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "Error: API request failed (HTTP ${HTTP_CODE})." >&2
  if [[ -s "$TMP" ]]; then
    # Try to surface API error body if present
    echo "Response:" >&2
    cat "$TMP" >&2 || true
  fi
  exit 1
fi

case "$FORMAT" in
  json)
    jq '.companies | map({id, name, role})' < "$TMP"
    ;;
  tsv)
    jq -r '.companies[] | [(.id|tostring), .name, (.role // "")] | @tsv' < "$TMP"
    ;;
  with-name)
    jq -r '.companies[] | [(.id|tostring), .name] | @tsv' < "$TMP"
    ;;
  ids)
    jq -r '.companies[]?.id' < "$TMP"
    ;;
  *)
    echo "Unknown format: $FORMAT" >&2
    exit 2
    ;;
esac

