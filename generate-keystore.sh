#!/bin/bash

# Hanuman Chalisa Cards - Release Keystore Generation Script
# This script generates a release signing keystore for Google Play Store

KEYSTORE_FILE="android/app/release-keystore.jks"
KEY_ALIAS="hanuman-chalisa-release"

echo "🔐 Generating Release Keystore for Hanuman Chalisa Cards"
echo ""
echo "This keystore will be used to sign your app for Play Store release."
echo "⚠️  IMPORTANT: Keep this keystore and passwords safe! You'll need them for all future updates."
echo ""

# Check if keystore already exists
if [ -f "$KEYSTORE_FILE" ]; then
    echo "⚠️  Keystore already exists at $KEYSTORE_FILE"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled. Existing keystore preserved."
        exit 0
    fi
fi

# Generate keystore
echo ""
echo "You'll be prompted for:"
echo "  - Keystore password (at least 6 characters)"
echo "  - Key password (at least 6 characters)"
echo "  - Your name and organization details"
echo ""

keytool -genkeypair \
    -v \
    -keystore "$KEYSTORE_FILE" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storetype JKS

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Keystore generated successfully at: $KEYSTORE_FILE"
    echo ""
    echo "📝 Next steps:"
    echo "  1. BACKUP this keystore file to a secure location"
    echo "  2. Update android/app/build.gradle with your keystore details"
    echo "  3. Set environment variables or use gradle.properties:"
    echo "     KEYSTORE_PASSWORD=<your keystore password>"
    echo "     KEY_ALIAS=$KEY_ALIAS"
    echo "     KEY_PASSWORD=<your key password>"
    echo ""
    echo "⚠️  NEVER commit the keystore or passwords to version control!"
    echo "    Add $KEYSTORE_FILE to .gitignore"
else
    echo ""
    echo "❌ Failed to generate keystore"
    exit 1
fi
