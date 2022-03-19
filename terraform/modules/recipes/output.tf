output "service_url" {
  value = google_cloud_run_service.recipes.status[0].url
}