#!/bin/bash
script_dir=$(dirname "$0")
pushd $script_dir
  bash plantuml/deploy.sh
  bash snyk/deploy.sh
  bash terraform/deploy.sh
  bash tfsec/deploy.sh
  bash firebase/deploy.sh
popd
