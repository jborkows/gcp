

# resource "google_cloudbuild_trigger" "terraform" {
#   name = "terraform"
#   project = var.project_id
#   provider = google-beta
#   filename = "terraform/cloudbuild.yaml"
#   service_account = var.service_account
#   ignored_files   = []
#     included_files  = [
#         "terraform/**",
#     ]
#    github {
#         name  = var.repository_name
#         owner = var.owner

#         push {
#             branch       = "^main$"
#             invert_regex = false
#         }
#     }
# }


# resource "google_cloudbuild_trigger" "firebase" {
#   name = "firebase"
#   description = "firebase website"
#   project = var.project_id
#   provider = google-beta
#   filename = "firebase/cloudbuild.json"
#   service_account = var.service_account
#   ignored_files   = [
#       "firebase/Dockerfile", 
#       "firebase/myapp/package.json", 
#       "firebase/myapp/package-lock.json", 
#       "firebase/cloudbuild-react.json"
#       ]
#     included_files  = [
#         "firebase/**",
#     ]
#    github {
#         name  = var.repository_name
#         owner = var.owner

#         push {
#             branch       = "^main$"
#             invert_regex = false
#         }
#     }
# }


# resource "google_cloudbuild_trigger" "firebase-react-build" {
#   name = "firebase-react-build"
#   description = "base image for react code"
#   project = var.project_id
#   provider = google-beta
#   filename = "firebase/cloudbuild-react.json"
#   service_account = var.service_account
#   ignored_files   = []
#     included_files  = [
#         "firebase/Dockerfile",
#          "firebase/package.json", 
#          "firebase/cloudbuild-react.json"
#     ]
#    github {
#         name  = var.repository_name
#         owner = var.owner

#         push {
#             branch       = "^main$"
#             invert_regex = false
#         }
#     }
# }

# resource "google_cloudbuild_trigger" "recipes" {
#   name = "recipes"
#   project = var.project_id
#   description = "dish recipes"
#   provider = google-beta
#   filename = "recipes/cloudbuild.yaml"
#   service_account = var.service_account
#   ignored_files   = ["recipes/base.dockerfile", "recipes/base.dockerfilebuilder.yaml", "recipes/go.mod", "recipes/go.sum", "recipes/base_version.txt"]
#     included_files  = [
#         "recipes/**",
#     ]
#    github {
#         name  = var.repository_name
#         owner = var.owner

#         push {
#             branch       = "^main$"
#             invert_regex = false
#         }
#     }
# }



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

    }
    logs_bucket = var.cloudbuildbucket
  }
}

resource "google_cloudbuild_trigger" "terraform" {
  name     = local.terraform_trigger_name
  project  = var.project_id
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
      name       = "$${_MYREPO}/snykbuild:0.1"
      args       = ["sh", "-c", "snyk iac test --json --severity-threshold=high  > /workspace/report_terraform$$(date '+%d-%m-%Y').json || true"]
      dir        = "terraform"
      secret_env = ["SNYK_TOKEN"]
    }
    step {
      name = "$${_MYREPO}/tfsec:0.1"
      args = ["sh", "-c", "tfsec .  > /workspace/report_tfsec$$(date '+%d-%m-%Y').txt || true"]
      dir  = "terraform"
    }

    step {
      name    = "gcr.io/cloud-builders/gsutil"
      args    = ["cp", "/workspace/report*", var.plantuml.bucket_name]
      timeout = "100s"
      dir     = "terraform"
    }

    step {
      id      = "init"
      name    = "$${_MYREPO}/terraformbuild:$_TERRAFORM_VERSION"
      args    = ["init"]
      timeout = "100s"
      dir     = "terraform"
    }
    step {
      id      = "apply changes"
      name    = "$${_MYREPO}/terraformbuild:$_TERRAFORM_VERSION"
      args    = ["apply", "-var=project_id=$PROJECT_ID", "-auto-approve"]
      dir     = "terraform"
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
    }
  }
}


resource "google_cloudbuild_trigger" "recipes" {
  name = "recipes"
  project = var.project_id
  description = "dish recipes"
  provider = google-beta
  # filename = "recipes/cloudbuild.yaml"
  service_account = var.service_account
  ignored_files   = []
    included_files  = [
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
      name       = "$${_MYREPO}/snykbuild:0.1"
      args       = ["sh", "-c", "snyk test --json --severity-threshold=high  > /workspace/report_recipes$$(date '+%d-%m-%Y').json || true"]
      dir        = "recipes"
      secret_env = ["SNYK_TOKEN"]
    }
    step {
      id = "copy reports..."
      name    = "gcr.io/cloud-builders/gsutil"
      args    = ["cp", "/workspace/report*", var.plantuml.bucket_name]
      timeout = "100s"
      dir     = "recipes"
    }
    step {
      name    = "gcr.io/cloud-builders/docker"
      args    = ["build", "-t", "$$_MYREPO/recipes:latest", "."]
      dir     = "recipes"
    }
    step {
      name    = "gcr.io/cloud-builders/docker"
      args    = ["push", "$$_MYREPO/recipes:latest", "."]
      dir     = "recipes"
    }

    step {
      name    = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      args    = ["gcloud", "beta", "builds", "triggers", "--project=$${PROJECT_ID}", "run", "${local.terraform_trigger_name}", "--branch", "$${BRANCH_NAME}"]
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
    }
  }
}

locals {
  terraform_trigger_name="terraform"
}