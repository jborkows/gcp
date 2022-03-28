
output "appId"             { 
    value = google_firebase_web_app.basic.app_id 
}
# output "apiKey"            {
#      value = data.google_firebase_web_app_config.basic.api_key 
# }
output "authDomain"        {
     value = data.google_firebase_web_app_config.basic.auth_domain 
}
# output "databaseURL"       {
#      value = lookup(data.google_firebase_web_app_config.basic, "database_url", "") 
# }
# output "storageBucket"     {
#      value = lookup(data.google_firebase_web_app_config.basic, "storage_bucket", "") 
# }
# output "messagingSenderId" {
#      value = lookup(data.google_firebase_web_app_config.basic, "messaging_sender_id", "") 
# }
# output "measurementId"     {
#      value = lookup(data.google_firebase_web_app_config.basic, "measurement_id", "") 
# }
output "config"  {
 value = google_storage_bucket_object.default.content
 sensitive = true
}