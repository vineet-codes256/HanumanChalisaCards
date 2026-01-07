#!/bin/bash

# Git History Cleanup Script for Hanuman Chalisa Cards
# This script uses git-filter-repo to permanently remove sensitive files from git history
# 
# ⚠️  WARNING: This rewrites git history! Only run this before making the repo public.
# ⚠️  After running, you'll need to force-push: git push origin --force --all
# ⚠️  Make a backup first: cp -r .git .git.backup

set -e

echo "🔐 Git History Cleanup Script"
echo "=============================="
echo ""
echo "⚠️  WARNING: This will rewrite git history!"
echo "⚠️  Make sure you have a backup of your repository"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [[ "$confirm" != "yes" ]]; then
    echo "Cancelled."
    exit 0
fi

# Check if git-filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
    echo ""
    echo "❌ git-filter-repo is not installed."
    echo ""
    echo "Install it with:"
    echo "  brew install git-filter-repo    # macOS"
    echo "  pip3 install git-filter-repo    # or via pip"
    echo ""
    exit 1
fi

echo ""
echo "📋 Backing up current .git directory..."
cp -r .git .git.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created: .git.backup.$(date +%Y%m%d_%H%M%S)"
echo ""

# List of sensitive file patterns to purge from history
echo "🗑️  Purging sensitive files from git history..."
echo ""

# Files to remove (adjust as needed)
SENSITIVE_FILES=(
    # Signing keys and keystores
    "*.jks"
    "*.keystore"
    "android/app/release-keystore.jks"
    "keystore.properties"
    "signing.properties"
    
    # Release artifacts
    "*.aab"
    "*.apk"
    "android/app/build/outputs/bundle/**/*.aab"
    "android/app/build/outputs/apk/**/*.apk"
    
    # Google services
    "google-services.json"
    "android/app/google-services.json"
    "**/google-services.json"
    
    # Environment files with potential secrets
    ".env"
    ".env.local"
    ".env.production"
    
    # Local properties (may contain SDK paths or secrets)
    "local.properties"
    "android/local.properties"
)

# Also purge unlicensed audio files from history
AUDIO_FILES=(
    "public/assets/BigBell.mp3"
    "public/assets/small-pooja-bell-fast.mp3"
)

echo "Removing the following file patterns:"
for pattern in "${SENSITIVE_FILES[@]}" "${AUDIO_FILES[@]}"; do
    echo "  - $pattern"
done

echo ""
read -p "Proceed with cleanup? (yes/no): " proceed

if [[ "$proceed" != "yes" ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🔄 Running git-filter-repo..."
echo ""

# Build the filter-repo command
FILTER_CMD="git filter-repo --force --invert-paths"

for pattern in "${SENSITIVE_FILES[@]}" "${AUDIO_FILES[@]}"; do
    FILTER_CMD="$FILTER_CMD --path '$pattern' --use-base-name"
done

# Execute the filter command
eval $FILTER_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Git history cleanup complete!"
    echo ""
    echo "📊 Repository statistics:"
    git count-objects -vH
    echo ""
    echo "🔍 Verifying sensitive files are gone..."
    echo ""
    
    # Verify cleanup
    ALL_CLEAN=true
    for pattern in "${SENSITIVE_FILES[@]}" "${AUDIO_FILES[@]}"; do
        if git log --all --name-only --pretty=format: | grep -q "$pattern"; then
            echo "⚠️  Warning: $pattern still found in history"
            ALL_CLEAN=false
        fi
    done
    
    if [ "$ALL_CLEAN" = true ]; then
        echo "✅ All sensitive files successfully removed from history!"
    else
        echo "⚠️  Some files may still exist. Review manually."
    fi
    
    echo ""
    echo "📝 Next steps:"
    echo "  1. Review the changes carefully"
    echo "  2. Test your repository: git log --name-only"
    echo "  3. If everything looks good, force-push to remote:"
    echo "     git push origin --force --all"
    echo "     git push origin --force --tags"
    echo ""
    echo "  4. Notify collaborators (if any) to re-clone the repo"
    echo ""
    echo "⚠️  If you need to restore, your backup is at: .git.backup.*"
    
else
    echo ""
    echo "❌ Cleanup failed. Check error messages above."
    echo "Your original .git is backed up at: .git.backup.*"
    exit 1
fi
