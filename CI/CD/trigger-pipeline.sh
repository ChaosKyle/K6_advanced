#!/bin/bash

# K6 CI/CD Pipeline Trigger Script
# This script demonstrates how to trigger the GitHub Actions workflow

set -e

echo "🚀 K6 Performance Test Pipeline Trigger"
echo "========================================"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Commit them first to see them in the pipeline"
fi

echo ""
echo "Choose how to trigger the pipeline:"
echo "1. Push current branch (triggers workflow automatically)"
echo "2. Create a test commit and push (demonstrates commit-based trigger)"
echo "3. Manual workflow dispatch (requires workflow_dispatch trigger)"
echo "4. View current pipeline status"
echo "5. Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🔄 Pushing current branch to trigger pipeline..."
        git push origin "$CURRENT_BRANCH"
        echo "✅ Branch pushed! Pipeline should start automatically."
        ;;
    2)
        echo "📝 Creating test commit..."
        # Create a small change to trigger the pipeline
        echo "# Test commit $(date)" >> test-trigger.txt
        git add test-trigger.txt
        git commit -m "Test commit to trigger K6 pipeline - $(date)"
        
        echo "🔄 Pushing test commit..."
        git push origin "$CURRENT_BRANCH"
        
        echo "✅ Test commit pushed! Pipeline should start automatically."
        echo "📄 Created test-trigger.txt (you can delete this file later)"
        ;;
    3)
        echo "🎯 Attempting manual workflow dispatch..."
        if gh workflow run "k6 Performance Test" 2>/dev/null; then
            echo "✅ Manual workflow triggered successfully!"
        else
            echo "❌ Manual dispatch failed. The workflow might not support workflow_dispatch."
            echo "   Try option 1 or 2 instead."
        fi
        ;;
    4)
        echo "📊 Current pipeline status:"
        gh run list --limit 5
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📈 Monitoring pipeline:"
echo "   • View in browser: gh repo view --web"
echo "   • Check status: gh run list"
echo "   • Follow logs: gh run watch"
echo ""

if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo "🌟 Note: Since you're on the main branch, both local AND cloud tests will run!"
else
    echo "ℹ️  Note: Since you're on branch '$CURRENT_BRANCH', only local tests will run."
    echo "   Push to 'main' branch to trigger cloud tests too."
fi

echo ""
echo "🎉 Pipeline trigger complete! Check GitHub Actions for results."