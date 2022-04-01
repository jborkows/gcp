
# output "storage_bucket_id" {
#   value = google_storage_bucket.bucket.id
# }

output "projectNumber" {
  value=data.google_project.project.number
}


output "projectName" {
  value=data.google_project.project.name
}


output "storageServiceAccount" {
  description = "service account"
  value = data.google_storage_project_service_account.gcs_account.email_address
}


output "cloudBuildServiceAccount" {
  description = "cloud build service account"
  value =data.google_service_account.gcp_account.name
}

output "firebasePage" {
  value = module.firebase.authDomain
}


output "firebaseId" {
  value = module.firebase.appId
}

output "firebaseConfig"{
  value = module.firebase.config
  sensitive = true
}


# output "recipesImage" {
#   value = data.external.recipes_digest.result.image
# }

# output "recipesPage" {
#   value = module.recipes.service_url
# }

output "firebaseSdkServiceAccount" {
  value = data.external.firebase_admin_sdk_account.result.account
}


# output "terraform_path" {
#   value = data.external.executor.result.path
# }



# output "cloud_version" {
#   value = data.external.executor.result.gcloudVersion
# }

