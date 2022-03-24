output "service_url" {
  value = google_cloud_run_service.recipe_svc.status[0].url
}