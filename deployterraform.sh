#!/bin/bash
export version=1.0
docker build -t gcr.io/$PROJECT_ID/terraformbuild:${version} -f terraformcloudbuild.dockerfile .
docker push gcr.io/$PROJECT_ID/terraformbuild:${version}
