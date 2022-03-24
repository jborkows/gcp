# gcp

jborkows@jb-tx-pw:~/programs/gcp/terraform$ chmod +r /home/jborkows/.config/gcloud/application_default_credentials.json
jborkows@jb-tx-pw:~/programs/gcp/terraform$ terraform init
Initializing the backend...

Error: storage.NewClient() failed: dialing: google: error getting credentials using GOOGLE_APPLICATION_CREDENTIALS environment variable: open /home/jborkows/.config/gcloud/application_default_credentials.json: permission denied

gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  cloudresourcemanager.googleapis.com

 export GOOGLE_APPLICATION_CREDENTIALS=/home/jborkows/gcloud/coastal-idea-336409-abf53916995b.json

 terraform import module.firebase."google_firebase_project"."default" coastal-idea-336409
 
PROJECT_ID=coastal-idea-336409
CLOUDBUILD_SA=service-1032380584635@gs-project-accounts.iam.gserviceaccount.com
 gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member serviceAccount:$CLOUDBUILD_SA --role projects/coastal-idea-336409/roles/CustomRole

gcr.io    

 gcloud projects add-iam-policy-binding coastal-idea-336409 \
 --member=serviceAccount:1032380584635@cloudbuild.gserviceaccount.com \
 --role=roles/resourcemanager.projectIamAdmin

 gcloud projects get-iam-policy coastal-idea-336409 \
--flatten="bindings[].members" \
--format='table(bindings.role)' \
--filter="bindings.members:serviceAccount:1032380584635@cloudbuild.gserviceaccount.com"


terraform import  -lock=false module.recipes.google_cloud_run_service.recipe_svc europe-central2/recipe
terraform force-unlock 1648152473471409