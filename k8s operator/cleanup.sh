#!/bin/bash

# K6 Distributed Testing Lab Cleanup Script

set -e

echo "🧹 Cleaning up K6 Distributed Testing Lab..."

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

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl not found. Please install kubectl."
    exit 1
fi

# Delete running test runs
print_status "Deleting running test runs..."
kubectl delete testruns --all -n k6-operator-system --timeout=60s || true

# Delete ConfigMaps
print_status "Deleting ConfigMaps..."
kubectl delete configmaps simple-test-script load-test-script stress-test-script -n k6-operator-system || true

# Delete K6 operator (optional - uncomment if you want to remove the operator completely)
# print_status "Deleting K6 operator..."
# kubectl delete -f https://github.com/grafana/k6-operator/releases/latest/download/bundle.yaml || true

# Delete namespace (this will also delete any remaining resources)
print_status "Deleting namespace..."
kubectl delete namespace k6-operator-system --timeout=120s || true

echo ""
print_status "✅ K6 Distributed Testing Lab cleanup complete!"
echo ""
print_warning "Note: The K6 operator itself was left installed for future use."
print_warning "To completely remove the operator, uncomment the relevant lines in this script."
echo ""
print_status "Lab cleanup finished! 🧹"