# Input Variables for DashGen Infrastructure

variable "project_name" {
  description = "Name of the Vercel project"
  type        = string
  default     = "dashgen"
}

variable "github_repo" {
  description = "GitHub repository (format: owner/repo)"
  type        = string
  default     = "Krosebrook/DashBoardGenv1.0"
}

variable "production_domain" {
  description = "Production domain name"
  type        = string
  default     = "dashgen.app"
}

variable "staging_domain" {
  description = "Staging domain name"
  type        = string
  default     = "staging.dashgen.app"
}

variable "enable_staging" {
  description = "Enable staging environment"
  type        = bool
  default     = true
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"
}

# Secrets (should be provided via environment variables or secrets manager)
variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API key"
  type        = string
  sensitive   = true
}

# Future: Supabase variables
variable "supabase_org_id" {
  description = "Supabase organization ID"
  type        = string
  default     = ""
}

variable "supabase_region" {
  description = "Supabase project region"
  type        = string
  default     = "us-east-1"
}

variable "supabase_db_password" {
  description = "Supabase database password"
  type        = string
  sensitive   = true
  default     = ""
}

# Future: Cloudflare variables
variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the domain"
  type        = string
  default     = ""
}

# Future: Stripe variables
variable "stripe_publishable_key" {
  description = "Stripe publishable key"
  type        = string
  default     = ""
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
  default     = ""
}

# Tags for resource management
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "DashGen"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}
