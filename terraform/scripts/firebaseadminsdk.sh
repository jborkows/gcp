#!/bin/bash
PROJECT=$1
ADMIN_NAME=$(gcloud iam service-accounts list --project ${PROJECT} --format="value(email)" | grep adminsdk 2>&1)

echo "{\"account\": \"${ADMIN_NAME}\"}"
