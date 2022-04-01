#!/bin/bash
set -u # or set -o nounset
: "${PROJECT_ID:?PROJECT_ID not set}"
: "${REPOSITORY_NAME:?REPOSITORY_NAME not set}"
: "${REPOSITORY_LOCATION:?REPOSITORY_LOCATION not set}"

script_dir=$(dirname "$0")
pushd $script_dir
export version=0.1
export image_name=${REPOSITORY_LOCATION}/$PROJECT_ID/$REPOSITORY_NAME/tfsec:${version} 
docker build -t $image_name   -f tfsec.dockerfile .
docker push $image_name
popd

