#!/bin/bash
export version=0.1
docker build -t gcr.io/$PROJECT_ID/terraformbuild:${version} -f terraformcloudbuild.dockerfile .
docker push gcr.io/$PROJECT_ID/terraformbuild:${version}
