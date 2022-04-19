variable "repository_name" {
  type = string
}

variable "owner" {
  type = string
}

variable "location" {
  type=string
}

variable "project_id" {
  type = string
}


variable "service_account" {
  type = string
}

variable "plantuml" {
  type = object({ bucket_name = string, version = string })
}

variable "repository_info" {
  type = object({ image_prefix = string })
}

variable "cloudbuildbucket" {
  type = string
}

variable "terraform_trigger_name" {
    type = string
    default = "terraform"
  
}

variable "recipes_image_name" {
  type=string
}

variable "reports_bucket" {
  type=string
}