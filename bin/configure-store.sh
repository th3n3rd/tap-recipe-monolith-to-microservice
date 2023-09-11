#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

WORKLOAD="$SCRIPT_DIR/../config/store-workload.yaml"
DATABASE_NAME="store-db"

if ! tanzu services class-claim get "$DATABASE_NAME" &> /dev/null ; then
    echo "Database not found"
    echo "Creating a new PostgreSQL service named $DATABASE_NAME"
    tanzu services class-claim create "$DATABASE_NAME" --class postgresql-unmanaged
    echo "Database '$DATABASE_NAME' created"
fi

kubectl delete -f "$WORKLOAD" || true
kubectl apply -f "$WORKLOAD"

tanzu apps workload tail store
