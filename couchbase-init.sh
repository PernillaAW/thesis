#!/bin/bash

set -e

echo "Waiting for CB to be ready..."

until curl -s http://couchbase:8091/pools > /dev/null; do 
    sleep 2 
done

couchbase-cli cluster-init \
    -c couchbase \
    --cluster-username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --cluster-password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --services data,index,query \
    --cluster-ramsize 4096 || true \
    --cluster-index-ramsize 1024 || true

couchbase-cli bucket-create \
    -c couchbase \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket optimized \
    --bucket-type couchbase \
    --bucket-ramsize 512 || true


couchbase-cli bucket-create \
    -c couchbase \
    --username $COUCHBASE_ADMINISTRATOR_USERNAME \
    --password $COUCHBASE_ADMINISTRATOR_PASSWORD \
    --bucket unoptimized \
    --bucket-type couchbase \
    --bucket-ramsize 512 || true