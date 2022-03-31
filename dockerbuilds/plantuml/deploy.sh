#!/bin/bash
script_dir=$(dirname "$0")
pushd $script_dir
export version=0.2
docker build -t gcr.io/$PROJECT_ID/plantuml:${version} .
docker push gcr.io/$PROJECT_ID/plantuml:${version}
popd
