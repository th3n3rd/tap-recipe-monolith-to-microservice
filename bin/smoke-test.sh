#!/bin/bash

TMP_FOLDER=$(mktemp -d)
trap "rm -rf $TMP_FOLDER" EXIT

APP_URL=${1:-$(kubectl get kservice store -o yaml | yq '.status.url' | tr -d '\n' )}
DEBUG_MODE=
JOURNEY=""

for arg in "$@"
do
    if [ "$arg" == "--debug" ]; then
        DEBUG_MODE="true"
        break
    elif [ "$arg" == "--customer-only" ]; then
        JOURNEY=":customer"
        break
    elif [ "$arg" == "--sales-clerk-only" ]; then
        JOURNEY=":sales-clerk"
        break
    fi
done

pushd e2e
    if ! APP_URL="$APP_URL" DEBUG_MODE="$DEBUG_MODE" yarn test"$JOURNEY" ; then
        echo "Smoke test failed"
        exit 1
    fi
popd

echo "Smoke test succeeded"
