#!/bin/bash
export version=0.1
docker build -t gcr.io/$PROJECT_ID/tfsec:${version} -f tfsec.dockerfile .
docker push gcr.io/$PROJECT_ID/tfsec:${version}
