resource "google_cloudbuild_trigger" "platuml" {
  name        = "plantumls"
  project     = var.project_id
  description = "diagrams for project"
  provider    = google-beta

  service_account = var.service_account

  included_files = [
    "umls/**",
  ]
  github {
    name  = var.repository_name
    owner = var.owner

    push {
      branch       = "^main$"
      invert_regex = false
    }
  }
  build {
    step {
      name    = "${var.repository_info.image_prefix}/plantuml:${var.plantuml.version}"
      args    = ["*.puml", "-output", "/workspace"]
      timeout = "120s"
      dir     = "umls"
    }

    step {
      name    = "gcr.io/cloud-builders/gsutil"
      args    = ["cp", "/workspace/*.png", var.plantuml.bucket_name]
      timeout = "120s"
      dir     = "umls"
    }

    options {
      logging = "GCS_ONLY"
      # worker_pool = google_cloudbuild_worker_pool.my-pool.id
    }
    logs_bucket = var.cloudbuildbucket
  }
}
