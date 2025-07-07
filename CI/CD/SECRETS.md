# GitHub Secrets Configuration

To run K6 performance tests with GitHub Actions, you need to configure the following secrets in your GitHub repository:

## Required Secrets

### K6_CLOUD_TOKEN
- **Description**: Your Grafana Cloud k6 API token
- **How to get**: 
  1. Go to [Grafana Cloud](https://grafana.com/auth/sign-up/create-account)
  2. Create a k6 account or sign in
  3. Navigate to Settings > API Tokens
  4. Generate a new token with appropriate permissions

### K6_CLOUD_PROJECT_ID
- **Description**: Your k6 project ID from Grafana Cloud
- **How to get**:
  1. In Grafana Cloud k6, go to your project
  2. Copy the project ID from the URL or project settings

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add the secret name and value
6. Click **Add secret**

## Note

These secrets are only required for cloud testing. Local k6 tests will run without them but won't upload results to Grafana Cloud.