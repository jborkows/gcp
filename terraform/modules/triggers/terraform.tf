
resource "google_cloudbuild_trigger" "terraform-build" {
  name     = "terraform-build"
  project  = var.project_id
  description = "performs check of terraform and trigger terraform apply"
  provider = google-beta
  # filename        = "terraform/cloudbuild.yaml"
  service_account = var.service_account
  ignored_files   = []
  included_files = [
    "terraform/**",
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
      args       = ["sh", "-c", "snyk iac test --json --severity-threshold=high  > /workspace/report_terraform$$(date '+%d-%m-%Y').json || true"]
      dir        = "terraform"
      secret_env = ["SNYK_TOKEN"]
      wait_for = ["-"]
    }
    step {
      id   = "tfsec"
      name = "$${_MYREPO}/tfsec:0.1"
      args = ["sh", "-c", "tfsec .  > /workspace/report_tfsec$$(date '+%d-%m-%Y').txt || true"]
      dir  = "terraform"
      wait_for = ["-"]
    }

    step {
      id      = "copy reports"
      name    = "gcr.io/cloud-builders/gsutil"
      args    = ["cp", "/workspace/report*", var.plantuml.bucket_name]
      timeout = "100s"
      dir     = "terraform"
      wait_for = ["snyk", "tfsec" ]
    }
    step {
      id   = "trigger terraform"
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      args = ["gcloud", "beta", "builds", "triggers", "--project=$${PROJECT_ID}", "run", "${var.terraform_trigger_name}", "--branch", "$${BRANCH_NAME}"]
    }
    available_secrets {
      secret_manager {
        env          = "SNYK_TOKEN"
        version_name = "projects/$PROJECT_ID/secrets/snyk-token/versions/1"
      }
    }

    options {
      logging = "GCS_ONLY"
      worker_pool = google_cloudbuild_worker_pool.my-pool.name
    }
    logs_bucket = var.cloudbuildbucket
    substitutions = {
      _MYREPO = "${var.repository_info.image_prefix}"
      _TERRAFORM_VERSION : "0.1"
    }
  }
}

resource "google_cloudbuild_trigger" "terraform" {
  name     = var.terraform_trigger_name
  project  = var.project_id
  provider = google-beta
  description = "applies infrastructure structure"
  # filename        = "terraform/cloudbuild.yaml"
  service_account = var.service_account
  ignored_files   = []
  included_files = [
    "doesnotexist/**",
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
      id      = "init"
      name    = "$${_MYREPO}/terraformbuild:$_TERRAFORM_VERSION"
      args    = ["init"]
      timeout = "100s"
      dir     = "terraform"
    }
    step {
      id   = "apply changes"
      name = "$${_MYREPO}/terraformbuild:$_TERRAFORM_VERSION"
      args = ["apply", "-var=project_id=$PROJECT_ID", "-auto-approve"]
      dir  = "terraform"
    }

    options {
      logging = "GCS_ONLY"
      worker_pool = google_cloudbuild_worker_pool.my-pool.name
    }
    logs_bucket = var.cloudbuildbucket
    substitutions = {
      _MYREPO = "${var.repository_info.image_prefix}"
      _TERRAFORM_VERSION : "0.1"
    }
  }
}
