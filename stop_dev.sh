#!/bin/bash
 
 source ./common_dev.sh


stopFirebase(){
    firebaseApp=$(ps e -ef | grep FIREBASE-GCP | grep "npm start"  | cut -d " " -f 3 |tr -d '\n')
    [[ -n "$firebaseApp" ]] && kill -s TERM $firebaseApp
    ps -ef | grep firebase | grep -v grep  | cut -d " " -f 3 | xargs -I {} kill -s TERM {};
}

killApplicationAtPort $RECIPES_PORT
killApplicationAtPort $RECIPES_DEBUG_PORT
stopFirebase




