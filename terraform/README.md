# DashGen Terraform Infrastructure
# Infrastructure as Code for production deployment

## Overview

This directory contains Terraform configurations for managing DashGen's infrastructure:

- **Vercel**: Hosting and deployment
- **Future: Supabase**: Backend services (database, auth, storage)
- **Future: Cloudflare**: WAF, rate limiting, security

## Prerequisites

1. **Terraform**: Install Terraform >= 1.0
   ```bash
   # macOS
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

2. **Vercel Account**: Sign up at https://vercel.com
3. **API Tokens**: Generate necessary API tokens

## Setup

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Configure Variables

Create `terraform.tfvars` (DO NOT commit this file):

```hcl
# Vercel Configuration
vercel_api_token = "your_vercel_api_token"
gemini_api_key   = "your_gemini_api_key"

# Project Configuration
project_name       = "dashgen"
github_repo        = "Krosebrook/DashBoardGenv1.0"
production_domain  = "dashgen.app"
staging_domain     = "staging.dashgen.app"
enable_staging     = true

# Future: Supabase Configuration
# supabase_org_id      = "your_org_id"
# supabase_region      = "us-east-1"
# supabase_db_password = "your_secure_password"

# Future: Cloudflare Configuration
# cloudflare_api_token = "your_cloudflare_token"
# cloudflare_zone_id   = "your_zone_id"
```

### 3. Alternatively: Use Environment Variables

```bash
export TF_VAR_vercel_api_token="your_token"
export TF_VAR_gemini_api_key="your_key"
# ... other variables
```

## Usage

### Plan Changes

```bash
terraform plan
```

### Apply Changes

```bash
terraform apply
```

### Destroy Infrastructure

```bash
terraform destroy
```

## File Structure

```
terraform/
├── README.md           # This file
├── main.tf            # Main infrastructure configuration
├── variables.tf       # Input variables
├── outputs.tf         # Output values (future)
├── terraform.tfvars   # Variable values (local, not committed)
└── .terraform/        # Terraform state and providers (generated)
```

## Security Best Practices

### 1. Secret Management

**DO NOT commit secrets to version control!**

Add to `.gitignore`:
```
terraform.tfvars
*.tfvars
.terraform/
terraform.tfstate*
```

**Use environment variables or secrets manager:**
- AWS Secrets Manager
- HashiCorp Vault
- GitHub Secrets (for CI/CD)

### 2. Remote State Storage

For production, use remote state storage:

```hcl
# In main.tf
terraform {
  backend "s3" {
    bucket         = "dashgen-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

### 3. State Locking

Prevent concurrent modifications with state locking:
- AWS: Use DynamoDB
- Terraform Cloud: Built-in locking
- Consul: Distributed locking

## Environments

### Production

```bash
terraform workspace select production
terraform apply -var-file=production.tfvars
```

### Staging

```bash
terraform workspace select staging
terraform apply -var-file=staging.tfvars
```

### Development

```bash
terraform workspace select development
terraform apply -var-file=development.tfvars
```

## Future Enhancements

### Supabase Integration

When implementing backend services:

1. Uncomment Supabase resources in `main.tf`
2. Add Supabase provider:
   ```bash
   terraform init -upgrade
   ```
3. Configure database schema and policies
4. Run migrations

### Cloudflare Integration

For enhanced security and performance:

1. Uncomment Cloudflare resources in `main.tf`
2. Configure WAF rules
3. Set up rate limiting
4. Enable caching and optimization

### Monitoring & Alerting

Future additions:
- Datadog monitoring
- PagerDuty alerting
- CloudWatch logs

## Troubleshooting

### Common Issues

**1. Provider Initialization Failed**
```bash
terraform init -upgrade
```

**2. State Lock Conflict**
```bash
terraform force-unlock <lock-id>
```

**3. Plan Shows Unexpected Changes**
```bash
terraform refresh
terraform plan
```

**4. Vercel API Authentication Failed**
- Verify API token is correct
- Check token has necessary permissions
- Regenerate token if needed

## CI/CD Integration

### GitHub Actions

Already configured in `.github/workflows/deploy.yml`:
- Automatic deployment on push to main
- Infrastructure validation in PRs

### Manual Deployment

```bash
# 1. Authenticate
export VERCEL_TOKEN="your_token"

# 2. Deploy
terraform apply -auto-approve
```

## Cost Estimation

### Current (MVP)
- **Vercel Pro**: $20/month (estimated)
- **Total**: ~$20/month

### Future (V1 with Backend)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Cloudflare Pro**: $20/month
- **Total**: ~$65/month

### Future (V2 at Scale)
- **Vercel Enterprise**: $Custom
- **Supabase Scale**: $Custom
- **Cloudflare Business**: $200/month
- **Total**: $500+/month (estimated)

## Support

For infrastructure questions:
- **Email**: devops@dashgen.app
- **Slack**: #infrastructure (internal)
- **Docs**: https://dashgen.app/docs/infrastructure

## License

Infrastructure code is part of the DashGen project and follows the same Apache 2.0 license.

---

**Last Updated**: 2026-01-14  
**Maintained By**: DevOps Team
