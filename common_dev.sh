#!/bin/bash

RECIPES_PORT=8081
RECIPES_DEBUG_PORT=2345

killApplicationAtPort(){
    port_number=$1
    echo "Searching for $1"
    running_app=$(lsof -ti :$1)
    [[ -n "$running_app" ]] && echo stopping $running_app
    [[ -n "$running_app" ]] && kill $running_app
}

pushd terraform
FIREBASE_CONFIG=$(echo "base64decode(nonsensitive(google_service_account_key.firebase_admin_key.private_key))" | terraform console | sed 's/<<EOT//' |  sed 's/EOT//')
PROJECT_ID=$(echo "data.google_project.project.project_id" | terraform console | tr -d "")
USER_PRIVS_CLAIM=$(terraform output userClaimsEnvName | tr -d "")
NEXT_PUBLIC_USER_PRIVS_CLAIM=$USER_PRIVS_CLAIM
popd
