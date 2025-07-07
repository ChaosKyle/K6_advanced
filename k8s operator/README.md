# K6 Distributed Testing Lab

This lab demonstrates how to run distributed K6 performance tests using the K6 operator in Kubernetes, following the [Grafana K6 documentation](https://grafana.com/docs/k6/latest/testing-guides/running-distributed-tests/).

## Prerequisites

- Access to a Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl installed and configured
- Git installed
- Basic understanding of Kubernetes concepts

## Lab Structure

```
k8s-operator/
├── README.md                 # This file
├── scripts/                  # Test scripts
│   ├── simple-test.js       # Basic distributed test
│   ├── load-test.js         # Load testing scenario
│   └── stress-test.js       # Stress testing scenario
├── manifests/               # Kubernetes manifests
│   ├── namespace.yaml       # Dedicated namespace
│   ├── configmaps.yaml      # Test script ConfigMaps
│   └── testruns.yaml        # TestRun resources
├── setup.sh                 # Lab setup script
└── cleanup.sh              # Lab cleanup script
```

## Quick Start

1. **Setup the lab environment:**
   ```bash
   ./setup.sh
   ```

2. **Run a simple distributed test:**
   ```bash
   kubectl apply -f manifests/testruns.yaml
   ```

3. **Monitor test execution:**
   ```bash
   kubectl get testruns -n k6-operator-system
   kubectl logs -f -l app=k6 -n k6-operator-system
   ```

4. **Clean up:**
   ```bash
   ./cleanup.sh
   ```

## Learning Objectives

By completing this lab, you will:
- Understand K6 distributed testing concepts
- Deploy and configure the K6 operator
- Create and run distributed load tests
- Monitor test execution and collect results
- Scale tests across multiple pods

## Lab Exercises

### Exercise 1: Basic Distributed Test
Run a simple HTTP test distributed across multiple K6 instances.

### Exercise 2: Scaling Tests
Experiment with different parallelism settings and observe performance differences.

### Exercise 3: Custom Test Scenarios
Create custom test scenarios using different K6 features.

## Troubleshooting

Common issues and solutions:
- **Operator not ready**: Check if all operator pods are running
- **Test fails to start**: Verify ConfigMap and TestRun configurations
- **Resource constraints**: Adjust resource limits in TestRun specs

## Additional Resources

- [K6 Documentation](https://k6.io/docs/)
- [K6 Operator GitHub](https://github.com/grafana/k6-operator)
- [Kubernetes Documentation](https://kubernetes.io/docs/)