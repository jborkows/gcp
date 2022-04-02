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
LATEST_VERSION=$(gcloud artifacts docker tags list $REPO --filter=" tag ~ $IMAGE AND tag:latest" --format="value(version)"| tr -d '\n' )
PAIR=$(gcloud artifacts docker tags list $REPO --filter=" version ~ $LATEST_VERSION" --format="value(tag)"| grep -v latest | tr -d '\n' )
if [ -z "$PAIR" ]
then
   echo "{\"tag\": \"1.00\"}";exit 0;
fi
#  the simplest regexp does not work!
# re=[0-9][.][0-9][0-9]
# PAIR=1
# if ! [[ $PAIR =~ re ]] ; then
#    echo "{\"tag\": \"1xx.00${PAIR}\"}";exit 0;  
# fi
 NEW_TAG=$(echo "scale=2; (100*$PAIR+1)/100"|bc)
 echo "{\"tag\": \"$NEW_TAG\"}"