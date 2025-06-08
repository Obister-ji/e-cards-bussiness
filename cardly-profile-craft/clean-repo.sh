#!/bin/bash
# Complete Repository Cleaning Script
# This removes all secrets from git history

echo "🧹 COMPLETE REPOSITORY CLEANING"
echo "==============================="

# Backup current directory
BACKUP_DIR="../cardly-backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup at: $BACKUP_DIR"
cp -r . "$BACKUP_DIR"

echo "🔍 Step 1: Checking for secret files..."
find . -name ".env*" -type f | head -10

echo "🗑️ Step 2: Removing all .env files..."
find . -name ".env*" -type f -delete

echo "📝 Step 3: Removing from git tracking..."
git rm --cached .env* 2>/dev/null || echo "No .env files were tracked"

echo "🔄 Step 4: Cleaning git history..."
# Method 1: Filter branch
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env.local .env.development .env.production .env.test' \
  --prune-empty --tag-name-filter cat -- --all

echo "🧹 Step 5: Cleaning references..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "📋 Step 6: Current status..."
git status

echo "🔍 Step 7: Checking for remaining secrets..."
if git log --all --full-history -- .env.local | head -5; then
    echo "⚠️ Secret file still in history, trying alternative method..."
    
    # Alternative: Create completely clean repo
    echo "🆘 Creating completely clean repository..."
    
    # Save current files
    mkdir ../temp-clean
    cp -r src ../temp-clean/
    cp -r public ../temp-clean/
    cp package.json ../temp-clean/
    cp *.md ../temp-clean/ 2>/dev/null || true
    cp *.ts ../temp-clean/ 2>/dev/null || true
    cp *.js ../temp-clean/ 2>/dev/null || true
    cp .gitignore ../temp-clean/
    
    # Remove current git history
    rm -rf .git
    
    # Initialize fresh repo
    git init
    git remote add origin https://github.com/Obister-ji/e-cards.git
    
    # Copy back clean files
    cp -r ../temp-clean/* .
    
    # Clean up
    rm -rf ../temp-clean
    
    echo "✅ Created fresh repository"
else
    echo "✅ No secrets found in history"
fi

echo ""
echo "🚀 Final steps:"
echo "1. Review current files:"
echo "   git status"
echo ""
echo "2. Add safe files:"
echo "   git add ."
echo ""
echo "3. Commit:"
echo "   git commit -m 'Clean repository - secure API key management'"
echo ""
echo "4. Force push:"
echo "   git push origin main --force"
echo ""
echo "📦 Backup saved at: $BACKUP_DIR"
