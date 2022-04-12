terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.15.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "4.15.0"
    }

    # external = {
    #   source = "hashicorp/external"
    #   version = "2.2.2"
    # }


  }
  backend "gcs" {
    bucket = "coastal-idea-336409-infrastructur"
    prefix = "terraform/state"
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
data "google_storage_project_service_account" "gcs_account" {}
data "google_service_account" "gcp_account" {
  account_id = "1032380584635@cloudbuild.gserviceaccount.com"
  project    = var.project_id
}

resource "google_container_registry" "registry" {
  project  = var.project_id
  location = "EU"
}

data "google_container_registry_image" "recipes" {
  name = "recipes"
  tag  = "latest"
}

resource "google_artifact_registry_repository" "my-repo" {
  provider = google-beta

  location      = var.region
  repository_id = "my-repository"
  description   = "example docker repository"
  format        = "DOCKER"
}


# WORKAROUND 
data "external" "recipes_digest" {
  program = ["sh", "${path.module}/scripts/get_latest_tag.sh", var.project_id, "recipes", local.repository_full]
}
# END WORKAROUND

data "external" "executor" {
  program = ["sh", "${path.module}/scripts/executor.sh"]
}

# Create a Google Cloud Storage Bucket
resource "google_storage_bucket" "bucket" {
  name                        = "${var.project_id}_reports"
  location                    = var.region
  uniform_bucket_level_access = true
  storage_class               = var.storage_class
  versioning {
    enabled = false
  }
  force_destroy = true

}

resource "google_storage_bucket" "documentation" {
  name                        = "${var.project_id}documentation"
  location                    = var.region
  uniform_bucket_level_access = true
  storage_class               = var.storage_class
  versioning {
    enabled = false
  }
  force_destroy = true

}


resource "google_storage_bucket" "builder" {
  name                        = "${var.project_id}_builder_logs"
  location                    = var.region
  uniform_bucket_level_access = true
  storage_class               = var.storage_class
  versioning {
    enabled = false
  }
  force_destroy = true

  lifecycle_rule {
    condition {
      age = 14
    }
    action {
      type = "Delete"
    }
  }

}


module "firebase" {
  source       = "./modules/firebase"
  project_id   = var.project_id
  project_name = data.google_project.project.name
  region       = var.region
  zone         = var.zone
  location     = var.firebase_config.location
  bucket_name  = var.firebase_config.bucket_name
  #   depends_on = [

  #   ]
}

module "triggers" {
  source          = "./modules/triggers"
  owner           = "jborkows"
  repository_name = "gcp"
  project_id      = var.project_id
  service_account = data.google_service_account.gcp_account.id
  plantuml = {
    bucket_name = google_storage_bucket.documentation.url
    version     = var.plant_uml_version
  }
  cloudbuildbucket = google_storage_bucket.builder.url
  repository_info = {
    image_prefix = "${local.repository_full}"
  }
  recipes_image_name = var.recipes_image_name
  location = var.region
  depends_on         = [google_storage_bucket.documentation, google_storage_bucket.builder, google_artifact_registry_repository.my-repo]
}



resource "google_app_engine_application" "app" {
  project       = var.project_id
  location_id   = var.region
  database_type = "CLOUD_FIRESTORE"
}

data "external" "firebase_admin_sdk_account" {
  program = ["sh", "${path.module}/scripts/firebaseadminsdk.sh", var.project_id]
}

data "google_service_account" "firebase_admin" {
  account_id = data.external.firebase_admin_sdk_account.result.account
}

resource "google_service_account_key" "firebase_admin_key" {
  service_account_id = data.google_service_account.firebase_admin.name
}

module "recipes" {
  source             = "./modules/recipes"
  project_id         = var.project_id
  service_account    = "recipes-worker"
  region             = var.region
  recipes_image_name = var.recipes_image_name
  repository_info = {
    image_prefix = "${local.repository_full}"
  }
  #  image="gcr.io/coastal-idea-336409/recipes@sha256:9cde27f716e5ea54eca1903f2747167dd439c91f4f3be1740c463637873d3e55"
  #  image="gcr.io/coastal-idea-336409/recipes:latest"
  firebase_config = base64decode(google_service_account_key.firebase_admin_key.private_key)
}


locals {
  repository_name = google_artifact_registry_repository.my-repo.name
  repository_full = "${var.region}-docker.pkg.dev/${var.project_id}/${local.repository_name}"
}
