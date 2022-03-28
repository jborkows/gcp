
# output "storage_bucket_id" {
#   value = google_storage_bucket.bucket.id
# }

output "project_number" {
  value=data.google_project.project.number
}


output "project_name" {
  value=data.google_project.project.name
}


output "storage_service_account" {
  description = "service account"
  value = data.google_storage_project_service_account.gcs_account.email_address
}


output "cloud_build_service_account" {
  description = "cloud build service account"
  value =data.google_service_account.gcp_account.name
}

output "firebase_page" {
  value = module.firebase.authDomain
}


output "firebase_id" {
  value = module.firebase.appId
}

output "recipes_image" {
  value = data.external.recipes_digest.result.image
}




output "executor" {
  value = data.external.executor.result.username
}


# output "terraform_path" {
#   value = data.external.executor.result.path
# }

output "recipes_page" {
  value = module.recipes.service_url
}

# output "cloud_version" {
#   value = data.external.executor.result.gcloudVersion
# }

