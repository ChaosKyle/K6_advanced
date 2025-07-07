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

# Check if GitHub CLI is installed (optional for some features)
GH_AVAILABLE=false
if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null 2>&1; then
        GH_AVAILABLE=true
        echo "✅ GitHub CLI detected and authenticated"
    else
        echo "⚠️  GitHub CLI found but not authenticated"
        echo "   Run 'gh auth login' to enable advanced features"
    fi
else
    echo "⚠️  GitHub CLI not installed"
    echo "   Install from: https://cli.github.com/ for advanced features"
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
if [[ "$GH_AVAILABLE" == true ]]; then
    echo "3. Manual workflow dispatch (GitHub CLI)"
    echo "4. View current pipeline status (GitHub CLI)"
else
    echo "3. Manual workflow dispatch (requires GitHub CLI - not available)"
    echo "4. View current pipeline status (requires GitHub CLI - not available)"
fi
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
        if [[ "$GH_AVAILABLE" == true ]]; then
            echo "🎯 Attempting manual workflow dispatch..."
            if gh workflow run "k6 Performance Test" 2>/dev/null; then
                echo "✅ Manual workflow triggered successfully!"
            else
                echo "❌ Manual dispatch failed. The workflow might not support workflow_dispatch."
                echo "   Try option 1 or 2 instead."
            fi
        else
            echo "❌ GitHub CLI not available. Install and authenticate with GitHub CLI first."
            echo "   Alternative: Use option 1 or 2 to trigger via git push"
        fi
        ;;
    4)
        if [[ "$GH_AVAILABLE" == true ]]; then
            echo "📊 Current pipeline status:"
            gh run list --limit 5
        else
            echo "❌ GitHub CLI not available. Install and authenticate with GitHub CLI first."
            echo "   Alternative: Check pipeline status at: https://github.com/your-username/your-repo/actions"
        fi
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
if [[ "$GH_AVAILABLE" == true ]]; then
    echo "   • View in browser: gh repo view --web"
    echo "   • Check status: gh run list"
    echo "   • Follow logs: gh run watch"
else
    echo "   • View in browser: Visit your GitHub repository > Actions tab"
    echo "   • Check status: Refresh the Actions page"
    echo "   • Follow logs: Click on any workflow run"
fi
echo ""

if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo "🌟 Note: Since you're on the main branch, both local AND cloud tests will run!"
else
    echo "ℹ️  Note: Since you're on branch '$CURRENT_BRANCH', only local tests will run."
    echo "   Push to 'main' branch to trigger cloud tests too."
fi

echo ""
echo "🎉 Pipeline trigger complete! Check GitHub Actions for results."