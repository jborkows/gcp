#!/bin/bash
 
 source ./common_dev.sh


killApplicationAtPort $RECIPES_PORT
killApplicationAtPort $RECIPES_DEBUG_PORT

