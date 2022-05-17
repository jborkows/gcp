data "external" "recipes_number" {
  program = ["sh", "${path.module}/../../scripts/new_numeric_tag.sh", var.project_id, var.recipes_image_name, var.repository_info.image_prefix]
}

resource "google_cloudbuild_trigger" "recipes-snyk" {
  name        = "recipes-snyk"
  project     = var.project_id
  description = "dish recipes"
  provider    = google-beta
  # filename = "recipes/cloudbuild.yaml"
  service_account = var.service_account
  ignored_files   = []
  included_files = [
    "recipes/**",
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
      id         = "snyk"
      name       = "$${_MYREPO}/snykbuild:0.1"
      args       = ["sh", "-c", "snyk test --json --severity-threshold=high  > /workspace/report_recipes$$(date '+%d-%m-%Y').json || true"]
      dir        = "recipes"
      secret_env = ["SNYK_TOKEN"]
    }
    step {
      id      = "copy reports..."
      name    = "gcr.io/cloud-builders/gsutil"
      args    = ["cp", "/workspace/report*", var.reports_bucket]
      timeout = "100s"
      dir     = "recipes"
    }

    available_secrets {
      secret_manager {
        env          = "SNYK_TOKEN"
        version_name = "projects/$PROJECT_ID/secrets/snyk-token/versions/1"
      }
    }

    options {
      logging = "GCS_ONLY"
      worker_pool = google_cloudbuild_worker_pool.my-pool.id
    }
    logs_bucket = var.cloudbuildbucket
    substitutions = {
      _MYREPO = "${var.repository_info.image_prefix}"
      _TERRAFORM_VERSION : "0.1"
    }
  }
}

resource "google_cloudbuild_trigger" "recipes" {
  name        = "recipes"
  project     = var.project_id
  description = "dish recipes"
  provider    = google-beta
  # filename = "recipes/cloudbuild.yaml"
  service_account = var.service_account
  ignored_files   = []
 included_files = [
    "recipes/**",
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
      id   = "build image"
      name = "gcr.io/cloud-builders/docker"
      args = ["build", "-t", "$${_MYREPO}/recipes:latest", "-t", "$${_MYREPO}/${var.recipes_image_name}:${data.external.recipes_number.result.tag}", "."]
      dir  = "recipes"
    }
    step {
      id   = "push image"
      name = "gcr.io/cloud-builders/docker"
      args = ["push", "$${_MYREPO}/${var.recipes_image_name}"]
      dir  = "recipes"
    }

    step {
      id   = "trigger terraform"
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk:slim"
      args = ["gcloud", "beta", "builds", "triggers", "--project=$${PROJECT_ID}", "run", "${var.terraform_trigger_name}", "--branch", "$${BRANCH_NAME}"]
    }

    options {
      logging = "GCS_ONLY"
      # worker_pool = google_cloudbuild_worker_pool.my-pool.id
    }
    logs_bucket = var.cloudbuildbucket
    substitutions = {
      _MYREPO = "${var.repository_info.image_prefix}"
      _TERRAFORM_VERSION : "0.1"
    }
  }
}
