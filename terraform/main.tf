terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.15.0"
    }
    google-beta = {
        source = "hashicorp/google-beta"
      version = "4.15.0"
    }

    # external = {
    #   source = "hashicorp/external"
    #   version = "2.2.2"
    # }

    
  }
  backend "gcs" {
    bucket  = "coastal-idea-336409-infrastructur"
    prefix  = "terraform/state"
  }
}


# provider "external" {
#   # Configuration options
# }

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

data "google_project" "project" {}
data "google_storage_project_service_account" gcs_account{}
data "google_service_account" "gcp_account" {
  account_id = "1032380584635-compute@developer.gserviceaccount.com"
  project = var.project_id
}

data "google_container_registry_image" "recipes" {
  name = "recipes"
  tag = "latest"
}

# WORKAROUND 
data "external" "recipes_digest" {
  program = ["sh", "${path.module}/scripts/get_latest_tag.sh", var.project_id, "recipes"]
}
# END WORKAROUND

# Create a Google Cloud Storage Bucket
resource "google_storage_bucket" "bucket" {
  name          = "${var.project_id}_example"
  location      = var.region
  uniform_bucket_level_access = true
  storage_class = var.storage_class
  versioning {
    enabled     = false
  }
  force_destroy = true

}

module "firebase" {
  source = "./modules/firebase"
  project_id = var.project_id
  project_name = data.google_project.project.name
  region  = var.region
  zone    = var.zone
  location = var.firebase_config.location
  bucket_name = var.firebase_config.bucket_name
#   depends_on = [

#   ]
}

module "triggers" {
  source = "./modules/triggers"
  owner = "jborkows"
  repository_name="gcp"
  project_id = var.project_id
  service_account = data.google_service_account.gcp_account.id
}



resource "google_app_engine_application" "app" {
  project     = var.project_id
  location_id = var.region
  database_type = "CLOUD_FIRESTORE"
}



# module "recipes"{
#   source = "./modules/recipes"
#    project_id = var.project_id
#    service_account="recipes-worker"
#    region=var.region
#    image=data.external.recipes_digest.result.image
#   #  image="gcr.io/coastal-idea-336409/recipes@sha256:9cde27f716e5ea54eca1903f2747167dd439c91f4f3be1740c463637873d3e55"
#   #  image="gcr.io/coastal-idea-336409/recipes:latest"
# }


