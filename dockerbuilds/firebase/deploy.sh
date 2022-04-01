set -u # or set -o nounset
: "${PROJECT_ID:?PROJECT_ID not set}"
: "${REPOSITORY_NAME:?REPOSITORY_NAME not set}"
: "${REPOSITORY_LOCATION:?REPOSITORY_LOCATION not set}"

tmp_dir=$(mktemp -d -t ci-XXXXXXXXXX)
pushd $tmp_dir
git clone https://github.com/GoogleCloudPlatform/cloud-builders-community.git 
pushd cloud-builders-community/firebase
# sed -i 's/gcr\.io\/$PROJECT_ID\/firebase/${REPOSITORY_LOCATION}\/$PROJECT_ID\/$REPOSITORY_NAME\/firebase/g' cloudbuild.yaml 
sed -i "s/gcr\.io\/\$PROJECT_ID\/firebase/${REPOSITORY_LOCATION}\/$PROJECT_ID\/$REPOSITORY_NAME\/firebase/g" cloudbuild.yaml 
gcloud builds submit . --project $PROJECT_ID
popd
popd
rm -rf $tmp_dir
# ${REPOSITORY_LOCATION}/$PROJECT_ID/$REPOSITORY_NAME/plantuml:${version}
# ${REPOSITORY_LOCATION}\/$PROJECT_ID\/$REPOSITORY_NAME\/firebase

# sed -i 's/gcr\.io\/$PROJECT_ID\/firebase/${REPOSITORY_LOCATION}\/$PROJECT_ID\/$REPOSITORY_NAME\/firebase/g' cloudbuild.yaml 
