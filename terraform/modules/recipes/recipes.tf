resource "google_service_account" "recipes_worker" {
  account_id   = var.service_account
  display_name = "Recipes worker SA"
}

# Set permissions
resource "google_project_iam_binding" "service_permissions" {
  for_each = toset([
    "run.invoker"
  ])

  project = var.project_id
  role       = "roles/${each.key}"
  members    = [local.recipes_worker_sa]
  depends_on = [google_service_account.recipes_worker]
}


# The Cloud Run service
resource "google_cloud_run_service" "recipes" {
  name                       = "recipes"
  location                   = var.region
  autogenerate_revision_name = true

  template {
    spec {
      service_account_name = google_service_account.recipes_worker.email
      containers {
        image = var.image
        # env {
        #   name  = "BUCKET_NAME"
        #   value = google_storage_bucket.media.name
        # }
        # env {
        #   name  = "FUNCTION_NAME"
        #   value = google_cloudfunctions_function.function.https_trigger_url
        # }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }


 metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "5"
        "run.googleapis.com/client-name"        = "terraform"
      }
    }

}

# Set service public
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.recipes.location
  project  = google_cloud_run_service.recipes.project
  service  = google_cloud_run_service.recipes.name

  policy_data = data.google_iam_policy.noauth.policy_data
  depends_on  = [google_cloud_run_service.recipes]
}

locals {
  deployment_name = "recipes"
  recipes_worker_sa  = "serviceAccount:${google_service_account.recipes_worker.email}"
}
