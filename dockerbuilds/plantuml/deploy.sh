#!/bin/bash
export version=0.1
docker build -t gcr.io/$PROJECT_ID/plantuml:${version} .
docker push gcr.io/$PROJECT_ID/plantuml:${version}
