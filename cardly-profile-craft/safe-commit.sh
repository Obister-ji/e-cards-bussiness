#!/bin/bash
# Safe Git Commit Script
# This script helps ensure you don't accidentally commit sensitive files

echo "🔐 Safe Commit Checker"
echo "====================="

# Check if .env is in .gitignore
if grep -q "^\.env$" .gitignore; then
    echo "✅ .env is properly ignored"
else
    echo "❌ WARNING: .env is not in .gitignore!"
    echo "Adding .env to .gitignore..."
    echo ".env" >> .gitignore
fi

# Check if .env is staged
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "❌ DANGER: .env file is staged for commit!"
    echo "Unstaging .env file..."
    git reset HEAD .env
    echo "✅ .env file unstaged"
fi

# Show what will be committed
echo ""
echo "📋 Files to be committed:"
git diff --cached --name-only

echo ""
echo "🔍 Checking for potential secrets..."

# Check for common secret patterns
if git diff --cached | grep -i "api_key\|secret\|password\|token" | grep -v "your_.*_here"; then
    echo "⚠️  WARNING: Potential secrets found in staged changes!"
    echo "Please review the above lines carefully."
    read -p "Continue with commit? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Commit cancelled"
        exit 1
    fi
fi

echo "✅ Security check passed!"
echo ""
echo "Ready to commit safely. Use:"
echo "git commit -m 'Your commit message'"
