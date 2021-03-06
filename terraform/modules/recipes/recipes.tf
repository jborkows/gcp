resource "google_service_account" "recipes_worker" {
  account_id   = var.service_account
  display_name = "Recipes worker SA"
}

# # Set permissions
resource "google_project_iam_binding" "service_permissions" {
  for_each = toset([
    "run.invoker"
  ])

  project    = var.project_id
  role       = "roles/${each.key}"
  members    = [local.recipes_worker_sa]
  depends_on = [google_service_account.recipes_worker]
}


data "external" "recipes_image_tag" {
  program = ["sh", "${path.module}/../../scripts/get_pair_for_lates.sh", var.project_id, var.recipes_image_name, var.repository_info.image_prefix]
}

# The Cloud Run service
resource "google_cloud_run_service" "recipe_svc" {
  name                       = local.deployment_name
  location                   = var.region
  autogenerate_revision_name = true

  template {
    spec {
      service_account_name  = google_service_account.recipes_worker.email
      container_concurrency = 3
      containers {
        image = "${var.repository_info.image_prefix}/${var.recipes_image_name}:${data.external.recipes_image_tag.result.tag}"
        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }
        env {
          name  = "FIREBASE_CONFIG"
          value = var.firebase_config
        }
      }
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "2"
        "run.googleapis.com/client-name"   = "terraform"
        "run.googleapis.com/ingress"       = "all"
        # "run.googleapis.com/ingress"        = "internal"
      }
    }

  }
  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    ignore_changes = [
      metadata.0.annotations,
    ]
  }


}

# Set service public
# data "google_iam_policy" "noauth" {
#   binding {
#     role = "roles/run.invoker"
#     members = [
#       "allUsers",
#     ]
#   }
# }
# v1/projects/coastal-idea-336409/locations/europe-central2/services/recipe

resource "google_cloud_run_service_iam_policy" "policy" {
  location = google_cloud_run_service.recipe_svc.location
  project  = google_cloud_run_service.recipe_svc.project
  service  = google_cloud_run_service.recipe_svc.name
  policy_data = jsonencode(
    {
      bindings = [
        {
          members = [
            #  "allAuthenticatedUsers",
            "allUsers"
          ]
          role = "roles/run.invoker"
        }
      ]
    }
  )
  depends_on = [
    google_cloud_run_service.recipe_svc,
    google_service_account.recipes_worker
  ]
}

# resource "google_cloud_run_service_iam_binding" "binding" {
#   location = google_cloud_run_service.recipe_svc.location
#   project = google_cloud_run_service.recipe_svc.project
#   service = google_cloud_run_service.recipe_svc.name
#   role = "roles/run.invoker"
#   members = [
#      "allAuthenticatedUsers",
#   ]
# }

# resource "google_cloud_run_service_iam_member" "service_privs" {
#   service  =  google_cloud_run_service.recipe_svc.name
#   location =  google_cloud_run_service.recipe_svc.location
#   project = var.project_id
#   role     = "roles/run.invoker"
#   member   = "allUsers"
#   depends_on = [
#     google_cloud_run_service.recipe_svc
#   ]
# }

locals {
  deployment_name   = "recipe"
  recipes_worker_sa = "serviceAccount:${google_service_account.recipes_worker.email}"
}
