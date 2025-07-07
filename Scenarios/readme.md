1 # K6 Scenarios Lab Demo

This directory contains comprehensive examples of K6 scenarios for different testing patterns.

## Files Overview

### Basic Examples
- `scenario-example.js` - Simple scenario examples
- `combined1.js` - Multiple scenarios with different executors
- `envar.js` - Environment variable usage

### Demo Files
- `basic-executors-demo.js` - Demonstrates all K6 executor types
- `advanced-scenarios-demo.js` - Complex testing patterns with custom metrics
- `scenario-configurations.js` - Configuration templates for different test types

## Running the Demos

### Basic Executors Demo
```bash
k6 run basic-executors-demo.js
```

### Advanced Scenarios Demo
```bash
k6 run advanced-scenarios-demo.js
```

### Configuration-based Testing
```bash
# Load test
k6 run -e TEST_TYPE=load scenario-configurations.js

# Stress test
k6 run -e TEST_TYPE=stress scenario-configurations.js

# Spike test
k6 run -e TEST_TYPE=spike scenario-configurations.js

# Volume test
k6 run -e TEST_TYPE=volume scenario-configurations.js

# Breakpoint test
k6 run -e TEST_TYPE=breakpoint scenario-configurations.js

# Multi-stage test
k6 run -e TEST_TYPE=multi-stage scenario-configurations.js
```

## K6 Executor Types

### 1. Shared Iterations
- Total iterations shared across all VUs
- Use case: Testing with exact number of requests

### 2. Per VU Iterations
- Each VU runs specified number of iterations
- Use case: Ensuring consistent load per virtual user

### 3. Constant VUs
- Fixed number of VUs for duration
- Use case: Steady-state load testing

### 4. Ramping VUs
- VUs increase/decrease over time
- Use case: Gradual load increase, ramp-up/ramp-down

### 5. Constant Arrival Rate
- Fixed rate of iterations per time unit
- Use case: Consistent throughput testing

### 6. Ramping Arrival Rate
- Arrival rate changes over time
- Use case: Variable throughput patterns

### 7. Externally Controlled
- Control VUs from external source
- Use case: Integration with external systems

## Testing Patterns

### Load Testing
- Normal expected load
- Validates performance under typical conditions

### Stress Testing
- Beyond normal capacity
- Finds breaking point and recovery behavior

### Spike Testing
- Sudden load increases
- Tests system resilience to traffic spikes

### Volume Testing
- Large amounts of data
- Tests system with high data volumes

### Soak Testing
- Extended duration at normal load
- Identifies memory leaks and degradation

## Advanced Features

### Custom Metrics
- Track business-specific metrics
- Monitor beyond standard HTTP metrics

### Scenario Sequencing
- Control when scenarios start
- Create complex test workflows

### Per-Scenario Configuration
- Unique settings per scenario
- Granular control over test execution

### Thresholds
- Pass/fail criteria
- Scenario-specific performance targets

## Grafana Cloud Integration

### Setup Grafana Cloud K6
1. Create a Grafana Cloud account at https://grafana.com/
2. Navigate to K6 section in your Grafana Cloud dashboard
3. Generate API token for K6 Cloud

### Environment Variables
Set your Grafana Cloud credentials:
```bash
export K6_CLOUD_TOKEN=your_api_token_here
export K6_CLOUD_PROJECT_ID=your_project_id_here
```

### Running Tests with Cloud Output

#### Basic Cloud Upload
```bash
# Upload results to Grafana Cloud
k6 run --out cloud basic-executors-demo.js

# Upload with custom test name
k6 run --out cloud --tag testid=basic-demo basic-executors-demo.js
```

#### Advanced Cloud Configuration
```bash
# Upload with custom tags and metadata
k6 run --out cloud \
  --tag testid=advanced-scenarios \
  --tag environment=production \
  --tag version=1.0.0 \
  advanced-scenarios-demo.js

# Upload configuration-based tests
k6 run --out cloud \
  --tag testid=stress-test \
  --tag environment=staging \
  -e TEST_TYPE=stress \
  scenario-configurations.js
```

### Cloud Test Options
Add cloud configuration to your test files:
```javascript
export const options = {
  cloud: {
    projectID: 3629735,
    name: 'K6 Scenarios Demo',
    tags: {
      environment: 'production',
      team: 'performance',
    },
  },
  scenarios: {
    // your scenarios here
  },
};
```

### Grafana Cloud CLI Commands
```bash
# Login to Grafana Cloud
k6 cloud login

# List cloud tests
k6 cloud list

# Get test details
k6 cloud get <test-id>

# Stop running cloud test
k6 cloud stop <test-id>
```

### Hybrid Local + Cloud Testing
Run locally but send metrics to cloud:
```bash
# Run locally with cloud metrics
k6 run --out cloud --local-execution basic-executors-demo.js

# Multiple outputs (local + cloud)
k6 run --out json=results.json --out cloud advanced-scenarios-demo.js
```

### Cloud Test Scheduling
Use Grafana Cloud UI to:
- Schedule recurring tests
- Set up alerts and notifications
- Create custom dashboards
- Monitor test trends over time

### Best Practices for Cloud Testing
1. Use meaningful test names and tags
2. Set appropriate test duration for cloud costs
3. Monitor cloud quota usage
4. Use cloud for long-running soak tests
5. Leverage cloud for distributed load generation

## Documentation
- Configure Scenarios: https://grafana.com/docs/k6/latest/using-k6/scenarios/#configure-scenarios
- Advanced Examples: https://grafana.com/docs/k6/latest/using-k6/scenarios/advanced-examples/
- Grafana Cloud K6: https://grafana.com/docs/grafana-cloud/k6/
- K6 Cloud API: https://grafana.com/docs/grafana-cloud/k6/cloud-rest-api/
