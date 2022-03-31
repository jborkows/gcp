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

