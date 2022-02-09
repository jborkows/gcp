
# output "storage_bucket_id" {
#   value = google_storage_bucket.bucket.id
# }

output "project_number" {
  value=data.google_project.project.number
}


output "project_name" {
  value=data.google_project.project.name
}


output "service_account" {
  description = "service account"
  value = data.google_storage_project_service_account.gcs_account.email_address
}

output "firebase_page" {
  value = module.firebase.authDomain
}
