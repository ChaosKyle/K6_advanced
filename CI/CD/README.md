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