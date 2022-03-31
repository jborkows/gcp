

resource "google_cloudbuild_trigger" "terraform" {
  name = "terraform"
  project = var.project_id
  provider = google-beta
  filename = "terraform/cloudbuild.yaml"
  service_account = var.service_account
  ignored_files   = []
    included_files  = [
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
}


resource "google_cloudbuild_trigger" "firebase" {
  name = "firebase"
  description = "firebase website"
  project = var.project_id
  provider = google-beta
  filename = "firebase/cloudbuild.json"
  service_account = var.service_account
  ignored_files   = [
      "firebase/Dockerfile", 
      "firebase/myapp/package.json", 
      "firebase/myapp/package-lock.json", 
      "firebase/cloudbuild-react.json"
      ]
    included_files  = [
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
}


resource "google_cloudbuild_trigger" "firebase-react-build" {
  name = "firebase-react-build"
  description = "base image for react code"
  project = var.project_id
  provider = google-beta
  filename = "firebase/cloudbuild-react.json"
  service_account = var.service_account
  ignored_files   = []
    included_files  = [
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
}

resource "google_cloudbuild_trigger" "recipes" {
  name = "recipes"
  project = var.project_id
  description = "dish recipes"
  provider = google-beta
  filename = "recipes/cloudbuild.yaml"
  service_account = var.service_account
  ignored_files   = ["recipes/base.dockerfile", "recipes/base.dockerfilebuilder.yaml", "recipes/go.mod", "recipes/go.sum", "recipes/base_version.txt"]
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
}



resource "google_cloudbuild_trigger" "platuml" {
  name        = "plantumls"
  project     = var.project_id
  description = "diagrams for project"
  provider    = google-beta

  service_account = var.service_account

  included_files = [
    "platuml/**",
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
      name       = "gcr.io/${var.project_id}/plantuml:${var.plantuml.version}"
      args       = ["*.diagram"]
      timeout    = "120s"
      dir        = "umls" 
    }
    step {
      name       = "gcr.io/cloud-builders/gsutil"
      args       = ["cp", "/workspace/*.png", var.plantuml.bucket_name]
      timeout    = "120s"
      dir        = "umls" 
    }

    options {
        logging                 = "GCS_ONLY" 
        
    }
    logs_bucket             = var.cloudbuildbucket
  }
}

