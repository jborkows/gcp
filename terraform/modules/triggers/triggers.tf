

resource "google_cloudbuild_worker_pool" "my-pool"{
    name = "my-pool"
    location = var.location
}


