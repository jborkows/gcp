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

# resource "google_cloudbuild_trigger" "frontend" {
#   name            = "frontend"
#   project         = var.project_id
#   description     = "firebase frontend"
#   provider        = google-beta
#   service_account = var.service_account
#   ignored_files   = []
#   included_files = [
#     "firebase/**",
#   ]
#   github {
#     name  = var.repository_name
#     owner = var.owner

#     push {
#       branch       = "^main$"
#       invert_regex = false
#     }
#   }
#   build {


#     step {
#       name = "$${_MYREPO}/react-base:$_REACT_BASE_VERSION"
#       args = ["ln",
#         "-s",
#         "/my-app/node_modules",
#       "node_modules"]
#       dir = "firebase"
#     }

#     step {
#       name = "$${_MYREPO}/react-base:$_REACT_BASE_VERSION"
#       args = ["sh",
#         "-c",
#         "/my-app/node_modules",
#       "npm run lint >/workspace/report_react_lint$$(date'+%d-%m-%Y').txt || true"]
#       dir = "firebase"
#     }

#     step {
#       name       = "$${_MYREPO}/snykbuild:0.1"
#       args       = ["sh", "-c", "snyk test --json --severity-threshold=high  > /workspace/report_frontend$$(date '+%d-%m-%Y').json || true"]
#       dir        = "firebase"
#       secret_env = ["SNYK_TOKEN"]
#     }


#     step {
#       id      = "copy reports..."
#       name    = "gcr.io/cloud-builders/gsutil"
#       args    = ["cp", "/workspace/report*", var.plantuml.bucket_name]
#       timeout = "100s"
#       dir     = "firebase"
#     }

#     step {
#       name = "$${_MYREPO}/react-base:$_REACT_BASE_VERSION"
#       args = ["npm",
#         "run",
#         "build"
#       ]
#       dir = "firebase"
#     }

#     step {
#       name = "$${_MYREPO}/firebase"
#       args = [
#         "deploy",
#         "--project",
#         "${PROJECT_ID}",
#         "--only",
#         "hosting"
#       ]
#       dir = "firebase"
#     }

#     available_secrets {
#       secret_manager {
#         env          = "SNYK_TOKEN"
#         version_name = "projects/$PROJECT_ID/secrets/snyk-token/versions/1"
#       }
#     }

#     options {
#       logging = "GCS_ONLY"

#     }
#     logs_bucket = var.cloudbuildbucket
#     substitutions = {
#       _MYREPO = "${var.repository_info.image_prefix}"
#       _TERRAFORM_VERSION : "0.1"
#       _REACT_BASE_VERSION = "1.9"
#     }
#   }
# }

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
         "firebase/cloudbuild-react.json"
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
      args = [  "build", "-t", "gcr.io/$PROJECT_ID/react-base", "-t","gcr.io/$PROJECT_ID/react-base:${data.external.date.result.date}" , "."]
      dir = "firebase"
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
