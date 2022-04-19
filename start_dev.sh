#!/bin/bash

RECIPES_PORT=8081
RECIPES_DEBUG_PORT=2345

pushd terraform
FIREBASE_CONFIG=$(echo "base64decode(nonsensitive(google_service_account_key.firebase_admin_key.private_key))" | terraform console)
PROJECT_ID=$(echo "data.google_project.project.project_id" | terraform console)
popd

pushd recipes
running_app=$(lsof -ti :$RECIPES_PORT)
echo $running_app
[[ -n "$running_app" ]] && echo $running_app
[[ -n "$running_app" ]] && kill $running_app
# FIREBASE_CONFIG=$FIREBASE_CONFIG PROJECT_ID=$PROJECT_ID PORT=$RECIPES_PORT go run main.go &
FIREBASE_CONFIG=$FIREBASE_CONFIG PROJECT_ID=$PROJECT_ID PORT=$RECIPES_PORT ~/go/bin/dlv debug main.go --headless --listen=:$RECIPES_DEBUG_PORT --api-version=2 --accept-multiclient --continue &
popd

pushd firebase
RECIPES_PORT=$RECIPES_PORT npm run dev
popd
