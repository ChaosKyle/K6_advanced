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

## Documentation
- Configure Scenarios: https://grafana.com/docs/k6/latest/using-k6/scenarios/#configure-scenarios
- Advanced Examples: https://grafana.com/docs/k6/latest/using-k6/scenarios/advanced-examples/
