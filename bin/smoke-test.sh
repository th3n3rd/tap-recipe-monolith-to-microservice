#!/bin/bash

TMP_FOLDER=$(mktemp -d)
trap "rm -rf $TMP_FOLDER" EXIT

APP_URL=${1:-$(kubectl get kservice store -o yaml | yq '.status.url' | tr -d '\n' )}
DEBUG_MODE=

for arg in "$@"
do
    if [ "$arg" == "--debug" ]; then
        DEBUG_MODE="true"
        break
    fi
done

pushd e2e
    if ! APP_URL="$APP_URL" DEBUG_MODE="$DEBUG_MODE" yarn test ; then
        echo "Smoke test failed"
        exit 1
    fi
popd

echo "Smoke test succeeded"
