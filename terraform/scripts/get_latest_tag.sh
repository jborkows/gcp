#!/bin/bash

# WORKAROUND SCRIPT

# The Terraform Google provider (as of 3.53.0) provides no way to get
# information about images in the Container registry.

# If Terraform sees the "latest" tag, it takes no action, even if the latest
# image has changed since last run.

# So, manually retrieve the most recent fully qualified digest for the image.

# This will ensure that a service is only redeployed if the image has been updated
# This will require you to run 'gcloud builds submit', or similar, separately.

PROJECT=$1
IMAGE=$2
REPO=$3

# deep JSON is invalid for terraform, so serve flat value
# LATEST=$(gcloud container images describe gcr.io/${PROJECT}/${IMAGE}:latest  --format="value(image_summary.fully_qualified_digest)" | tr -d '\n')
# LATEST=$(gcloud artifacts docker images list $REPO --filter="package ~ $IMAGE" --format="value(version)" | tr -d '\n')
LATEST=$(gcloud artifacts docker tags list $REPO --filter="tag ~ latest" --filter="tag ~ $IMAGE"  --format="value(version)" | tr -d '\n')
GCLOUD_CCC=$(gcloud version --ongoing 2>&1)

# echo "{\"image\": \"${LATEST}\"}"
# SNAP_DIR=$(ls /snap/bin --format=comma |  sed -e 's/"/\n\,"/g' )
SNAP_DIR=$(which terraform )
echo "{\"project\": \"${PROJECT}\", \"image\": \"${REPO}/${IMAGE}@${LATEST}\" }"

REPO=europe-central2-docker.pkg.dev/coastal-idea-336409/my-repository