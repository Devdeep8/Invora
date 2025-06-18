#!/bin/bash

# Invora Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting Invora deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
ENVIRONMENT=${1:-"staging"}

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    print_error "Invalid environment. Use 'staging' or 'production'."
    exit 1
fi

print_status "Deploying to $ENVIRONMENT environment..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm ci

# Step 2: Run linting
print_status "Running ESLint..."
if ! npm run lint; then
    print_error "Linting failed. Please fix the issues before deploying."
    exit 1
fi
print_success "Linting passed!"

# Step 3: Run tests
print_status "Running tests..."
if ! npm run test:ci; then
    print_error "Tests failed. Please fix the failing tests before deploying."
    exit 1
fi
print_success "All tests passed!"

# Step 4: Type checking
print_status "Running type checking..."
if ! npm run type-check; then
    print_error "Type checking failed. Please fix TypeScript errors before deploying."
    exit 1
fi
print_success "Type checking passed!"

# Step 5: Build application
print_status "Building application..."
if ! npm run build; then
    print_error "Build failed. Please fix build errors before deploying."
    exit 1
fi
print_success "Build completed successfully!"

# Step 6: Run database migrations (if needed)
print_status "Checking database migrations..."
if command -v npx &> /dev/null; then
    if [ "$ENVIRONMENT" = "production" ]; then
        print_status "Running production database migrations..."
        npx prisma migrate deploy
    else
        print_status "Running development database migrations..."
        npx prisma migrate dev --name auto-migration
    fi
    print_success "Database migrations completed!"
else
    print_warning "Prisma CLI not found. Skipping database migrations."
fi

# Step 7: Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Deploying to production..."
    
    # Add your production deployment commands here
    # Example: Deploy to Vercel
    if command -v vercel &> /dev/null; then
        vercel --prod --confirm
        print_success "Deployed to production successfully!"
    else
        print_warning "Vercel CLI not found. Please deploy manually."
    fi
    
elif [ "$ENVIRONMENT" = "staging" ]; then
    print_status "Deploying to staging..."
    
    # Add your staging deployment commands here
    # Example: Deploy to Vercel staging
    if command -v vercel &> /dev/null; then
        vercel --confirm
        print_success "Deployed to staging successfully!"
    else
        print_warning "Vercel CLI not found. Please deploy manually."
    fi
fi

# Step 8: Post-deployment checks
print_status "Running post-deployment checks..."

# Add health checks here
# Example: Check if the application is responding
# curl -f http://your-app-url/api/health || exit 1

print_success "Deployment completed successfully! 🎉"
print_status "Environment: $ENVIRONMENT"
print_status "Timestamp: $(date)"

# Optional: Send notification
# You can add Slack, Discord, or email notifications here
# Example:
# curl -X POST -H 'Content-type: application/json' \
#     --data '{"text":"Invora deployed successfully to '$ENVIRONMENT'!"}' \
#     YOUR_SLACK_WEBHOOK_URL