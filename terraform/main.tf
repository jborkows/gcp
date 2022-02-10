terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.8.0"
    }
    google-beta = {
        source = "hashicorp/google-beta"
      version = "4.8.0"
    }
  }
  backend "gcs" {
    bucket  = "coastal-idea-336409-infrastructur"
    prefix  = "terraform/state"
  }
}
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