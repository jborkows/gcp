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

variable "user_claims_env_name" {
  default = "userRoles"
  type = string
}

variable "firebase_config" {
  type = object({bucket_name = string, location=string})
  default = {
    bucket_name = "fb-coastal-idea-336409-config-europe-central2",
    location = "europe-central2"
  }
}

variable "plant_uml_version" {
  default = "0.1"
  type = string
}


variable "recipes_image_name" {
  type=string
  default="recipes"
}