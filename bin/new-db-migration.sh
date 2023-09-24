#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

DESCRIPTION=${1:-"your-description-here"}
MIGRATION_FILE="$SCRIPT_DIR/../store/src/main/resources/db/migration/V$(date +"%Y%m%d%H%M%S")__$DESCRIPTION.sql"

touch "$MIGRATION_FILE"

echo "Created new migration file: $MIGRATION_FILE"
