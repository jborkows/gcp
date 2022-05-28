#!/bin/bash
pushd ..
source prepare-env.sh
popd
go build -o bin/claims
