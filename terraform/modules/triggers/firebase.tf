
data "external" "base_react" {
  program = ["sh", "${path.module}/../../scripts/get_pair_for_lates.sh", var.project_id, local.react_base_name, var.repository_info.image_prefix]
}

resource "google_cloudbuild_trigger" "frontend" {
  name            = local.frontend_trigger
  project         = var.project_id
  description     = "firebase frontend"
  provider        = google-beta
  service_account = var.service_account
  ignored_files   = [
      "firebase/Dockerfile",
         "firebase/package.json", 
         "firebase/package-lock.json", 
        #  "firebase/cloudbuild-react.json"
  ]
  included_files = [
    "firebase/**",
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
      id = "fetch data from base image"
      name = "$${_MYREPO}/react-base:$_REACT_BASE_VERSION"
      args = ["ln",
        "-s",
        "/my-app/node_modules",
      "node_modules"]
      dir = "firebase"
    }

    step {
      id = "npm linter"
      name = "$${_MYREPO}/react-base:$_REACT_BASE_VERSION"
      args = ["sh",
        "-c",
        "/my-app/node_modules",
      "npm run lint >/workspace/report_react_lint$$(date'+%d-%m-%Y').txt || true"]
      dir = "firebase"
    }

    step {
      id = "snyk"
      name       = "$${_MYREPO}/snykbuild:0.1"
      args       = ["sh", "-c", "snyk test --json --severity-threshold=high  > /workspace/report_frontend$$(date '+%d-%m-%Y').json || true"]
      dir        = "firebase"
      secret_env = ["SNYK_TOKEN"]
    }


    step {
      id      = "copy reports..."
      name    = "gcr.io/cloud-builders/gsutil"
      args    = ["cp", "/workspace/report*", var.plantuml.bucket_name]
      timeout = "100s"
      dir     = "firebase"
    }

    step {
      id = "build react"
      name = "$${_MYREPO}/react-base:$_REACT_BASE_VERSION"
      args = ["npm",
        "run",
        "build"
      ]
      dir = "firebase"
    }

    step {
      id = "deploy to firebase"
      name = "$${_MYREPO}/firebase"
      args = [
        "deploy",
        "--project",
        "$${PROJECT_ID}",
        "--only",
        "hosting"
      ]
      dir = "firebase"
    }

    available_secrets {
      secret_manager {
        env          = "SNYK_TOKEN"
        version_name = "projects/$PROJECT_ID/secrets/snyk-token/versions/1"
      }
    }

    options {
      logging = "GCS_ONLY"

    }
    logs_bucket = var.cloudbuildbucket
    substitutions = {
      _MYREPO = "${var.repository_info.image_prefix}"
      _TERRAFORM_VERSION : "0.1"
      _REACT_BASE_VERSION = "${data.external.base_react.result.tag}"
    }
  }
}

data "external" "date" {
  program = ["sh", "${path.module}/../../scripts/date.sh"]
}

resource "google_cloudbuild_trigger" "frontend-base" {
  name            = "frontend-base-docker"
  project         = var.project_id
  description     = "firebase frontend"
  provider        = google-beta
  service_account = var.service_account
  ignored_files   = []
  included_files = [
    "firebase/Dockerfile",
         "firebase/package.json", 
         "firebase/package-lock.json", 
        #  "firebase/cloudbuild-react.json"
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
      name = "gcr.io/cloud-builders/docker"
      args = [  "build", "-t", "$${_MYREPO}/${local.react_base_name}", "-t","$${_MYREPO}/${local.react_base_name}:${data.external.date.result.date}" , "."]
      dir = "firebase"
    }

    step {
      name = "gcr.io/cloud-builders/docker"
      args = [  "push", "$${_MYREPO}/${local.react_base_name}"]
      dir = "firebase"
    }

     step {
      name    = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      args    = ["gcloud", "beta", "builds", "triggers", "--project=$${PROJECT_ID}", "run", "${var.terraform_trigger_name}", "--branch", "$${BRANCH_NAME}"]
    }
  
    options {
      logging = "GCS_ONLY"

    }
    logs_bucket = var.cloudbuildbucket
    substitutions = {
      _MYREPO = "${var.repository_info.image_prefix}"
      _TERRAFORM_VERSION : "0.1"
    }
  }
}

locals {
  react_base_name="react-base"
  frontend_trigger="frontend"
}