#!/bin/bash
GCLOUD_CCC=$(gcloud version --ongoing 2>&1)

echo "{\"username\": \"${USER}\", \"gcloudVersion\": \"${GCLOUD_CCC}\"}"
