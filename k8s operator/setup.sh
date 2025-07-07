#!/bin/bash

# K6 Distributed Testing Lab Setup Script

set -e

echo "🚀 Setting up K6 Distributed Testing Lab..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl not found. Please install kubectl."
    exit 1
fi

# Check cluster connectivity
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

print_status "Prerequisites check passed!"

# Create namespace
print_status "Creating namespace..."
kubectl apply -f manifests/namespace.yaml

# Wait for namespace to be ready
kubectl wait --for=condition=Active namespace/k6-operator-system --timeout=60s

# Install K6 operator
print_status "Installing K6 operator..."

# Check if operator is already installed
if kubectl get deployment k6-operator-controller-manager -n k6-operator-system &> /dev/null; then
    print_warning "K6 operator already installed. Skipping installation."
else
    # Install K6 operator using kubectl
    kubectl apply -f https://github.com/grafana/k6-operator/releases/latest/download/bundle.yaml
    
    # Wait for operator deployment to be ready
    print_status "Waiting for K6 operator to be ready..."
    kubectl wait --for=condition=Available deployment/k6-operator-controller-manager -n k6-operator-system --timeout=300s
fi

# Create ConfigMaps for test scripts
print_status "Creating ConfigMaps for test scripts..."
kubectl apply -f manifests/configmaps.yaml

# Verify ConfigMaps
print_status "Verifying ConfigMaps..."
kubectl get configmaps -n k6-operator-system

echo ""
print_status "✅ K6 Distributed Testing Lab setup complete!"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run a simple test:"
echo "   kubectl apply -f manifests/testruns.yaml"
echo ""
echo "2. Monitor test execution:"
echo "   kubectl get testruns -n k6-operator-system"
echo "   kubectl logs -f -l app=k6 -n k6-operator-system"
echo ""
echo "3. View test results:"
echo "   kubectl logs -l app=k6 -n k6-operator-system"
echo ""
echo "4. Clean up when done:"
echo "   ./cleanup.sh"
echo ""
print_status "Happy testing! 🎯"