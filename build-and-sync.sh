#!/bin/bash

# Quick Build Script for Hanuman Chalisa Cards
# Builds the web app, syncs with Android, and prepares for Play Store

set -e

echo "🕉️  Hanuman Chalisa Cards - Build & Sync"
echo "========================================"
echo ""

# Build web app
echo "📦 Building web app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Web build failed"
    exit 1
fi

echo "✅ Web build complete"
echo ""

# Sync with Capacitor
echo "🔄 Syncing with Android..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Android sync failed"
    exit 1
fi

echo "✅ Android sync complete"
echo ""

# Check for keystore
if [ -f "android/app/release-keystore.jks" ]; then
    echo "🔐 Release keystore found"
    
    # Check if signing is configured
    if grep -q "signingConfig signingConfigs.release" android/app/build.gradle 2>/dev/null; then
        echo "✅ Signing configured"
        echo ""
        echo "Ready to build release AAB! Run:"
        echo "  cd android && ./gradlew bundleRelease"
    else
        echo "⚠️  Keystore exists but signing not enabled in build.gradle"
        echo "   Uncomment the signing line in buildTypes.release"
    fi
else
    echo "⚠️  No release keystore found"
    echo "   Run: ./generate-keystore.sh to create one"
fi

echo ""
echo "📱 Next steps:"
echo "  1. Test in Android Studio: npx cap open android"
echo "  2. Generate keystore: ./generate-keystore.sh"
echo "  3. Build release: cd android && ./gradlew bundleRelease"
echo "  4. See DEPLOYMENT_GUIDE.md for Play Store submission"
echo ""
echo "🙏 Jai Hanuman!"
