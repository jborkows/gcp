#!/bin/bash
export version=0.4
docker build -t gcr.io/$PROJECT_ID/infracostbuild:${version} -f infracost.dockerfile . --build-arg PROJECT_ID=$PROJECT_ID --build-arg TERRAFORM_BUILDER_VERSION=0.1
docker push gcr.io/$PROJECT_ID/infracostbuild:${version}
