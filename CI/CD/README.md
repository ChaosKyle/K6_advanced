# K6 Performance Testing with GitHub Actions

This repository demonstrates how to set up automated performance testing using K6 and GitHub Actions, based on the [Grafana blog post](https://grafana.com/blog/2024/07/15/performance-testing-with-grafana-k6-and-github-actions/).

## Files Overview

- `test.js` - K6 performance test script
- `.github/workflows/k6-performance-test.yml` - GitHub Actions workflow
- `SECRETS.md` - Documentation for required GitHub secrets

## Quick Start

1. **Clone and Push**: Push this repository to your GitHub account
2. **Configure Secrets**: Set up the required GitHub secrets (see `SECRETS.md`)
3. **Test Locally**: Run `k6 run test.js` to test locally
4. **Trigger CI**: Push changes to trigger the GitHub Actions workflow

## Running Tests Locally

### Prerequisites
- Install K6 on your local machine:
  ```bash
  # macOS (using Homebrew)
  brew install k6
  
  # Windows (using Chocolatey)
  choco install k6
  
  # Linux (using package manager)
  sudo apt-get install k6
  ```

### Local Test Execution
1. **Navigate to the project directory**:
   ```bash
   cd /path/to/your/project
   ```

2. **Run the basic test**:
   ```bash
   k6 run test.js
   ```

3. **Run with custom parameters**:
   ```bash
   # Run with more virtual users
   k6 run --vus 100 test.js
   
   # Run for longer duration
   k6 run --duration 5m test.js
   
   # Run with custom thresholds
   k6 run --threshold http_req_duration=p(95)<200 test.js
   ```

4. **View detailed output**:
   ```bash
   # Run with verbose output
   k6 run --verbose test.js
   
   # Save results to JSON
   k6 run --out json=results.json test.js
   ```

## Running Tests in GitHub Actions (Cloud)

### Automatic Triggers
The CI/CD pipeline automatically runs tests in the following scenarios:

1. **On every push** to any branch:
   - Runs local K6 tests
   - Validates code changes
   - Provides quick feedback

2. **On pull requests** to main branch:
   - Runs local K6 tests
   - Prevents merging if tests fail
   - Ensures code quality

3. **On main branch** (additional):
   - Runs cloud K6 tests
   - Uploads results to Grafana Cloud
   - Provides detailed performance analytics

### Manual Triggers
You can also manually trigger tests:

1. **Via GitHub UI**:
   - Go to Actions tab in your repository
   - Select "k6 Performance Test" workflow
   - Click "Run workflow"

2. **Via GitHub CLI**:
   ```bash
   gh workflow run "k6 Performance Test"
   ```

### Monitoring Test Results

#### Local Test Results (All Branches)
- View results in the GitHub Actions logs
- Check the "Run local k6 test" step
- Look for performance metrics and threshold violations

#### Cloud Test Results (Main Branch Only)
- Access detailed results in Grafana Cloud
- View performance trends over time
- Set up alerts for performance degradation
- Compare results across different commits

### Test Status Indicators
- ✅ **Green**: All tests passed, thresholds met
- ❌ **Red**: Tests failed or thresholds violated
- ⏳ **Yellow**: Tests are currently running

## Test Configuration

The test script (`test.js`) includes:
- **Duration**: 1 minute
- **Virtual Users**: 50
- **Target URL**: https://quickpizza.grafana.com/
- **Thresholds**: 
  - Error rate < 1%
  - 95th percentile response time < 500ms

## Workflow Behavior

- **All branches**: Runs local k6 tests
- **Main branch**: Also runs cloud tests (uploads results to Grafana Cloud)
- **Pull requests**: Runs local tests for validation

## Customization

Edit `test.js` to:
- Change target URL
- Modify load testing parameters
- Add different test scenarios
- Update performance thresholds

## Prerequisites

- GitHub repository
- Grafana Cloud k6 account (for cloud features)
- K6 installed locally (for development)