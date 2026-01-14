# DashGen Infrastructure - Vercel + Future Supabase
# This Terraform configuration manages the infrastructure for DashGen

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    # Future: Add Supabase provider when available
    # supabase = {
    #   source  = "supabase/supabase"
    #   version = "~> 1.0"
    # }
  }
  
  # Remote state storage (recommended for production)
  # backend "s3" {
  #   bucket = "dashgen-terraform-state"
  #   key    = "production/terraform.tfstate"
  #   region = "us-east-1"
  #   encrypt = true
  #   dynamodb_table = "terraform-lock"
  # }
}

# Provider Configuration
provider "vercel" {
  # API token should be set via VERCEL_API_TOKEN environment variable
  # or passed as a variable
  api_token = var.vercel_api_token
}

# Vercel Project
resource "vercel_project" "dashgen" {
  name      = var.project_name
  framework = "vite"
  
  git_repository = {
    type = "github"
    repo = var.github_repo
  }
  
  build_command   = "npm run build"
  output_directory = "dist"
  install_command = "npm ci"
  
  # Environment Variables
  environment = [
    {
      key    = "NODE_ENV"
      value  = "production"
      target = ["production"]
    },
    {
      key    = "GEMINI_API_KEY"
      value  = var.gemini_api_key
      target = ["production", "preview"]
      type   = "secret"
    }
  ]
  
  # Production settings
  settings = {
    framework = "vite"
  }
}

# Production Domain
resource "vercel_project_domain" "production" {
  project_id = vercel_project.dashgen.id
  domain     = var.production_domain
}

# Staging Domain (optional)
resource "vercel_project_domain" "staging" {
  count      = var.enable_staging ? 1 : 0
  project_id = vercel_project.dashgen.id
  domain     = var.staging_domain
}

# Future: Supabase Project Configuration
# resource "supabase_project" "dashgen" {
#   organization_id = var.supabase_org_id
#   name            = "dashgen-${var.environment}"
#   region          = var.supabase_region
#   database_password = var.supabase_db_password
# }

# Future: Supabase Database Schema
# resource "supabase_database" "main" {
#   project_id = supabase_project.dashgen.id
#   
#   # Tables, functions, and policies defined here or via migrations
# }

# Future: Cloudflare Configuration for WAF and Rate Limiting
# provider "cloudflare" {
#   api_token = var.cloudflare_api_token
# }
#
# resource "cloudflare_zone_settings_override" "dashgen" {
#   zone_id = var.cloudflare_zone_id
#   
#   settings {
#     security_level = "high"
#     challenge_ttl  = 3600
#     browser_cache_ttl = 3600
#     
#     minify {
#       css  = "on"
#       js   = "on"
#       html = "on"
#     }
#     
#     security_header {
#       enabled = true
#       max_age = 31536000
#       include_subdomains = true
#       preload = true
#     }
#   }
# }
#
# resource "cloudflare_rate_limit" "api" {
#   zone_id = var.cloudflare_zone_id
#   threshold = 100
#   period = 60
#   match {
#     request {
#       url_pattern = "${var.production_domain}/api/*"
#     }
#   }
#   action {
#     mode = "challenge"
#     timeout = 3600
#   }
# }

# Outputs
output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.dashgen.id
}

output "production_url" {
  description = "Production deployment URL"
  value       = "https://${var.production_domain}"
}

output "staging_url" {
  description = "Staging deployment URL"
  value       = var.enable_staging ? "https://${var.staging_domain}" : "Not configured"
}

# Future outputs
# output "supabase_project_url" {
#   description = "Supabase project URL"
#   value       = supabase_project.dashgen.api_url
#   sensitive   = true
# }
