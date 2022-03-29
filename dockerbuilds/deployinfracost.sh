#!/bin/bash
export version=0.1
docker build -t gcr.io/$PROJECT_ID/infracostbuild:${version} -f infracost.dockerfile .
docker push gcr.io/$PROJECT_ID/infracostbuild:${version}
