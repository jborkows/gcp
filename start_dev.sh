#!/bin/bash
 
source ./common_dev.sh




pushd recipes
killApplicationAtPort $RECIPES_PORT
killApplicationAtPort $RECIPES_DEBUG_PORT
# FIREBASE_CONFIG=$FIREBASE_CONFIG PROJECT_ID=$PROJECT_ID PORT=$RECIPES_PORT go run main.go &
FIREBASE_CONFIG=$FIREBASE_CONFIG PROJECT_ID=$PROJECT_ID PORT=$RECIPES_PORT ~/go/bin/dlv debug main.go --headless --listen=:$RECIPES_DEBUG_PORT --api-version=2 --accept-multiclient --continue &
popd

pushd firebase
RECIPES_PORT=$RECIPES_PORT npm run dev
popd
