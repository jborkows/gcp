#!/bin/bash
GCLOUD_CCC=$(gcloud version --ongoing 2>&1)
DATE=$(date "+%Y%m%d_%H%M%S")
echo "{\"date\": \"${DATE}\"}"
