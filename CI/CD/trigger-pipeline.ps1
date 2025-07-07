# K6 CI/CD Pipeline Trigger Script (PowerShell)
# This script demonstrates how to trigger the GitHub Actions workflow

Write-Host "🚀 K6 Performance Test Pipeline Trigger" -ForegroundColor Green
Write-Host "========================================"

# Check if we're in a git repository
try {
    $null = git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Not in git repository"
    }
}
catch {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Check if GitHub CLI is installed (optional for some features)
$GH_AVAILABLE = $false
try {
    $null = Get-Command gh -ErrorAction Stop
    try {
        $null = gh auth status 2>$null
        if ($LASTEXITCODE -eq 0) {
            $GH_AVAILABLE = $true
            Write-Host "✅ GitHub CLI detected and authenticated" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  GitHub CLI found but not authenticated" -ForegroundColor Yellow
            Write-Host "   Run 'gh auth login' to enable advanced features"
        }
    }
    catch {
        Write-Host "⚠️  GitHub CLI found but not authenticated" -ForegroundColor Yellow
        Write-Host "   Run 'gh auth login' to enable advanced features"
    }
}
catch {
    Write-Host "⚠️  GitHub CLI not installed" -ForegroundColor Yellow
    Write-Host "   Install from: https://cli.github.com/ for advanced features"
}

# Get current branch
try {
    $CURRENT_BRANCH = git rev-parse --abbrev-ref HEAD
    Write-Host "📍 Current branch: $CURRENT_BRANCH" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error: Could not determine current branch" -ForegroundColor Red
    exit 1
}

# Check if there are uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Warning: You have uncommitted changes" -ForegroundColor Yellow
    Write-Host "   Commit them first to see them in the pipeline"
}

Write-Host ""
Write-Host "Choose how to trigger the pipeline:"
Write-Host "1. Push current branch (triggers workflow automatically)"
Write-Host "2. Create a test commit and push (demonstrates commit-based trigger)"
if ($GH_AVAILABLE) {
    Write-Host "3. Manual workflow dispatch (GitHub CLI)"
    Write-Host "4. View current pipeline status (GitHub CLI)"
}
else {
    Write-Host "3. Manual workflow dispatch (requires GitHub CLI - not available)" -ForegroundColor DarkGray
    Write-Host "4. View current pipeline status (requires GitHub CLI - not available)" -ForegroundColor DarkGray
}
Write-Host "5. Exit"
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "🔄 Pushing current branch to trigger pipeline..." -ForegroundColor Blue
        try {
            git push origin $CURRENT_BRANCH
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Branch pushed! Pipeline should start automatically." -ForegroundColor Green
            }
            else {
                Write-Host "❌ Push failed. Check your git configuration and network connection." -ForegroundColor Red
            }
        }
        catch {
            Write-Host "❌ Push failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host "📝 Creating test commit..." -ForegroundColor Blue
        try {
            # Create a small change to trigger the pipeline
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            "# Test commit $timestamp" | Out-File -FilePath "test-trigger.txt" -Append -Encoding UTF8
            
            git add test-trigger.txt
            git commit -m "Test commit to trigger K6 pipeline - $timestamp"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "🔄 Pushing test commit..." -ForegroundColor Blue
                git push origin $CURRENT_BRANCH
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Test commit pushed! Pipeline should start automatically." -ForegroundColor Green
                    Write-Host "📄 Created test-trigger.txt (you can delete this file later)"
                }
                else {
                    Write-Host "❌ Push failed. Check your git configuration and network connection." -ForegroundColor Red
                }
            }
            else {
                Write-Host "❌ Commit failed. Check your git configuration." -ForegroundColor Red
            }
        }
        catch {
            Write-Host "❌ Test commit failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    "3" {
        if ($GH_AVAILABLE) {
            Write-Host "🎯 Attempting manual workflow dispatch..." -ForegroundColor Blue
            try {
                gh workflow run "k6 Performance Test" 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Manual workflow triggered successfully!" -ForegroundColor Green
                }
                else {
                    Write-Host "❌ Manual dispatch failed. The workflow might not support workflow_dispatch." -ForegroundColor Red
                    Write-Host "   Try option 1 or 2 instead."
                }
            }
            catch {
                Write-Host "❌ Manual dispatch failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        else {
            Write-Host "❌ GitHub CLI not available. Install and authenticate with GitHub CLI first." -ForegroundColor Red
            Write-Host "   Alternative: Use option 1 or 2 to trigger via git push"
        }
    }
    "4" {
        if ($GH_AVAILABLE) {
            Write-Host "📊 Current pipeline status:" -ForegroundColor Blue
            try {
                gh run list --limit 5
            }
            catch {
                Write-Host "❌ Failed to get pipeline status: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        else {
            Write-Host "❌ GitHub CLI not available. Install and authenticate with GitHub CLI first." -ForegroundColor Red
            Write-Host "   Alternative: Check pipeline status at: https://github.com/your-username/your-repo/actions"
        }
    }
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📈 Monitoring pipeline:" -ForegroundColor Cyan
if ($GH_AVAILABLE) {
    Write-Host "   • View in browser: gh repo view --web"
    Write-Host "   • Check status: gh run list"
    Write-Host "   • Follow logs: gh run watch"
}
else {
    Write-Host "   • View in browser: Visit your GitHub repository > Actions tab"
    Write-Host "   • Check status: Refresh the Actions page"
    Write-Host "   • Follow logs: Click on any workflow run"
}
Write-Host ""

if ($CURRENT_BRANCH -eq "main") {
    Write-Host "🌟 Note: Since you're on the main branch, both local AND cloud tests will run!" -ForegroundColor Yellow
}
else {
    Write-Host "ℹ️  Note: Since you're on branch '$CURRENT_BRANCH', only local tests will run." -ForegroundColor Blue
    Write-Host "   Push to 'main' branch to trigger cloud tests too."
}

Write-Host ""
Write-Host "🎉 Pipeline trigger complete! Check GitHub Actions for results." -ForegroundColor Green