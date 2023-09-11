#!/bin/bash

APP_URL=${1:-$(kubectl get kservice store -o yaml | yq '.status.url' | tr -d '\n' )}
pushd e2e
    if ! yarn test "$APP_URL" &> /dev/null ; then
        echo "Smoke test failed"
        exit 1
    fi
popd

echo "Smoke test succeeded"
