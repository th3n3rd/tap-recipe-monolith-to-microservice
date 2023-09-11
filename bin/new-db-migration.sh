#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

MIGRATION_FILE="$SCRIPT_DIR/../store/src/main/resources/db/migration/V$(date +"%Y%m%d%H%M%S")__your-description-here.sql"

touch "$MIGRATION_FILE"

echo "Created new migration file: $MIGRATION_FILE"
