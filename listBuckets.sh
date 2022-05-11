#!/bin/bash
 
source ./common_dev.sh
projectId=$(echo $PROJECT_ID | tr -d \")
gsutil list -p $projectId | xargs -I {}  gsutil du -sh {};
