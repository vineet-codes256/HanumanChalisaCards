#!/bin/bash

# Hanuman Chalisa Cards - Icon Generation Script
# This script generates all required icon sizes for web and Android

SOURCE_ICON="public/icon-source.png"
OUTPUT_DIR="public/icons"
ANDROID_RES="android/app/src/main/res"

echo "🔨 Generating icons for Hanuman Chalisa Cards..."

# Create directories if they don't exist
mkdir -p "$OUTPUT_DIR"

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo "❌ Error: Source icon not found at $SOURCE_ICON"
    echo "Please save your Hanuman image as public/icon-source.png first"
    exit 1
fi

# Generate web icons
echo "📱 Generating web icons..."
magick "$SOURCE_ICON" -resize 192x192 "$OUTPUT_DIR/icon-192.png"
magick "$SOURCE_ICON" -resize 512x512 "$OUTPUT_DIR/icon-512.png"
magick "$SOURCE_ICON" -resize 180x180 "$OUTPUT_DIR/apple-touch-icon.png"
magick "$SOURCE_ICON" -resize 32x32 "$OUTPUT_DIR/favicon-32.png"
magick "$SOURCE_ICON" -resize 16x16 "$OUTPUT_DIR/favicon-16.png"

# Generate favicon.ico with multiple sizes
magick "$SOURCE_ICON" -resize 16x16 \
        "$SOURCE_ICON" -resize 32x32 \
        "$SOURCE_ICON" -resize 48x48 \
        "public/favicon.ico"

echo "🤖 Generating Android icons..."

# Android launcher icons (mipmap directories)
magick "$SOURCE_ICON" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher.png"
magick "$SOURCE_ICON" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher.png"
magick "$SOURCE_ICON" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png"
magick "$SOURCE_ICON" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png"
magick "$SOURCE_ICON" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png"

# Android foreground icons for adaptive icons
magick "$SOURCE_ICON" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher_foreground.png"
magick "$SOURCE_ICON" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher_foreground.png"
magick "$SOURCE_ICON" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_foreground.png"
magick "$SOURCE_ICON" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_foreground.png"
magick "$SOURCE_ICON" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_foreground.png"

# Android round icons
magick "$SOURCE_ICON" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"
magick "$SOURCE_ICON" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"
magick "$SOURCE_ICON" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"
magick "$SOURCE_ICON" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"
magick "$SOURCE_ICON" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"

# Splash screen icons
echo "🎨 Generating splash screen icons..."
mkdir -p "$ANDROID_RES/drawable"
magick "$SOURCE_ICON" -resize 288x288 "$ANDROID_RES/drawable/splash.png"

echo "✅ Icon generation complete!"
echo ""
echo "Generated files:"
echo "  - Web icons in $OUTPUT_DIR/"
echo "  - Android icons in $ANDROID_RES/mipmap-*/"
echo "  - Favicon in public/"
echo ""
echo "Next steps:"
echo "  1. Build your app: npm run build"
echo "  2. Sync with Capacitor: npx cap sync"
echo "  3. Test on your device!"
