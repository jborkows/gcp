
variable "project_id" {
    type = string
}


variable "service_account" {
    type = string
}

variable "region" {
    type = string
}

variable "recipes_image_name" {
    type = string 
}

variable "firebase_config" {
  
}

variable "repository_info" {
  type = object({ image_prefix = string })
}
