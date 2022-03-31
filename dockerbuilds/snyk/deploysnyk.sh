#!/bin/bash
export version=0.1
docker build -t gcr.io/$PROJECT_ID/snykbuild:${version} -f snyk.dockerfile .
docker push gcr.io/$PROJECT_ID/snykbuild:${version}
