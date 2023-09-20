#!/bin/bash

TMP_FOLDER=$(mktemp -d)
trap "rm -rf $TMP_FOLDER" EXIT

APP_URL=${1:-$(kubectl get kservice store -o yaml | yq '.status.url' | tr -d '\n' )}
pushd e2e
    if ! yarn test "$APP_URL" "$@" &> "$TMP_FOLDER/output.log" ; then
        cat "$TMP_FOLDER/output.log"
        echo "Smoke test failed"
        exit 1
    fi
popd

echo "Smoke test succeeded"
