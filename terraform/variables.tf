variable "region" {
  default     = "europe-central2"
  type = string
}

variable "zone" {
 default = "europe-central2-a"
 type = string
}

variable "project_id" {
  default = "coastal-idea-336409"
  type = string
}

variable "storage_class" {
  default = "STANDARD"
  type = string
}

variable "firebase_config" {
  type = object({bucket_name = string, location=string})
  default = {
    bucket_name = "fb-coastal-idea-336409-config-europe-central2",
    location = "europe-central2"
  }
}

# variable firebase_service_account{
#  default = "firebase-adminsdk-dgsku@coastal-idea-336409.iam.gserviceaccount.com"
# }
