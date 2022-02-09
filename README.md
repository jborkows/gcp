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