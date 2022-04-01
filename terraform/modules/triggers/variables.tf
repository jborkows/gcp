variable "repository_name" {
    type = string
}

variable "owner" {
    type = string
}

variable "project_id" {
    type = string
}


variable "service_account" {
    type = string
}

variable "plantuml" {
    type = object({bucket_name = string, version=string})
}

variable "repository_info" {
  type = object({image_prefix = string})
}

variable "cloudbuildbucket" {
    type = string
}
