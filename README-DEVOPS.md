# 🚀 Invora DevOps Guide

This guide covers the complete DevOps setup for the Invora project, including testing, CI/CD, and deployment.

## 📋 Table of Contents

- [Testing Setup](#testing-setup)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Local Development with Docker](#local-development-with-docker)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Monitoring & Logging](#monitoring--logging)

## 🧪 Testing Setup

### Running Tests Locally

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci
```

### Test Structure

```
__tests__/
├── components/          # Component tests
├── utils/              # Utility function tests
├── actions/            # Server action tests
└── pages/              # Page component tests
```

### Writing Tests

Example component test:
```javascript
import { render, screen } from '@testing-library/react'
import MyComponent from '../src/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## 🔄 GitHub Actions CI/CD

### Pipeline Overview

The CI/CD pipeline runs on every push and pull request:

1. **Test Stage**
   - Linting (ESLint)
   - Code formatting check (Prettier)
   - Type checking (TypeScript)
   - Unit tests with coverage
   - Build verification

2. **Security Stage**
   - NPM audit
   - Snyk security scanning

3. **Deploy Stage**
   - Staging deployment (develop branch)
   - Production deployment (main branch)

### Branch Strategy

- `main` → Production deployment
- `develop` → Staging deployment
- Feature branches → Testing only

### Required Secrets

Set these in your GitHub repository settings:

#### Authentication & Database
```
AUTH_SECRET=your-auth-secret
DATABASE_URL=your-production-database-url
STAGING_DATABASE_URL=your-staging-database-url
```

#### Email Configuration
```
EMAIL_SERVER_HOST=your-email-host
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email-user
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=your-sender-email
```

#### Deployment (Vercel)
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

#### Security (Optional)
```
SNYK_TOKEN=your-snyk-token
```

## 🐳 Local Development with Docker

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Services

- **app**: Next.js application (port 3000)
- **postgres**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)

### Database Setup

```bash
# Run migrations
docker-compose exec app npx prisma migrate dev

# Seed database
docker-compose exec app npx prisma db seed

# View database
docker-compose exec postgres psql -U postgres -d invora
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Environment Variables**
   Set all required environment variables in Vercel dashboard

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Production Deployment

```bash
# Build production image
docker build -t invora:latest .

# Run production container
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" invora:latest
```

## 🔧 Environment Variables

### Development (.env.local)
```env
AUTH_SECRET="your-development-secret"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/invora"
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="1025"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="dev@invora.local"
```

### Production
```env
AUTH_SECRET="your-production-secret"
DATABASE_URL="your-production-database-url"
EMAIL_SERVER_HOST="your-smtp-host"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email-user"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourdomain.com"
```

## 📊 Quality Gates

### Code Quality Standards

- **Test Coverage**: Minimum 70%
- **Linting**: ESLint must pass
- **Formatting**: Prettier must pass
- **Type Safety**: TypeScript checks must pass
- **Security**: No high-severity vulnerabilities

### Pre-commit Hooks

Install Husky for pre-commit hooks:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run test:ci"
```

## 🔍 Monitoring & Logging

### Application Monitoring

1. **Error Tracking**
   - Add Sentry for error tracking
   - Monitor application performance

2. **Analytics**
   - Track user interactions
   - Monitor business metrics

3. **Infrastructure**
   - Monitor database performance
   - Track API response times

### Log Management

```javascript
// Use structured logging
console.log(JSON.stringify({
  level: 'info',
  message: 'User logged in',
  userId: user.id,
  timestamp: new Date().toISOString()
}))
```

## 🛠️ Useful Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run prettier     # Format code
npm run type-check   # Check TypeScript
```

### Testing
```bash
npm test                    # Run tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage
npm run test:ci             # Run tests for CI
```

### Database
```bash
npx prisma generate         # Generate Prisma client
npx prisma migrate dev      # Run migrations (dev)
npx prisma migrate deploy   # Run migrations (prod)
npx prisma studio          # Open Prisma Studio
npx prisma db seed         # Seed database
```

### Docker
```bash
docker-compose up -d        # Start services
docker-compose down         # Stop services
docker-compose logs -f      # View logs
docker-compose exec app sh  # Access app container
```

## 🚨 Troubleshooting

### Common Issues

1. **Tests Failing**
   - Check environment variables
   - Ensure database is accessible
   - Verify mock configurations

2. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Check environment variables

3. **Deployment Issues**
   - Verify secrets are set correctly
   - Check build logs
   - Ensure environment variables match

### Getting Help

1. Check GitHub Actions logs
2. Review error messages carefully
3. Verify environment configuration
4. Check database connectivity
5. Review recent changes

---

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check the troubleshooting section
- Review the logs for detailed error information

Happy coding! 🎉