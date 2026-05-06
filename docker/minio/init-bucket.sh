#!/bin/sh
set -e

mc alias set local http://minio:9000 epct_admin epct_dev_pw
mc mb --ignore-existing local/epct-media
mc anonymous set download local/epct-media
echo "MinIO bucket epct-media initialized"
