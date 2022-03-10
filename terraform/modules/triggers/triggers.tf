

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
