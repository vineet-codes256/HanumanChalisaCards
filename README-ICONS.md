# Icon Setup for Hanuman Chalisa Cards

## Quick Start

1. **Save your Hanuman image as `public/icon-source.png`**
   - Use the beautiful Hanuman meditation image you have
   - Make sure it's at least 512x512 pixels (1024x1024 recommended)
   - Square format works best

2. **Run the icon generator:**
   ```bash
   chmod +x generate-icons.sh
   ./generate-icons.sh
   ```

3. **Build and sync:**
   ```bash
   npm run build
   npx cap sync android
   ```

## What Gets Generated

### Web Icons
- `/public/icons/icon-192.png` - PWA icon (192x192)
- `/public/icons/icon-512.png` - PWA icon (512x512)
- `/public/icons/apple-touch-icon.png` - iOS home screen (180x180)
- `/public/icons/favicon-32.png` - Browser favicon (32x32)
- `/public/icons/favicon-16.png` - Browser favicon (16x16)
- `/public/favicon.ico` - Multi-size favicon

### Android Icons
- `mipmap-mdpi/` - 48x48 (for mdpi devices)
- `mipmap-hdpi/` - 72x72 (for hdpi devices)
- `mipmap-xhdpi/` - 96x96 (for xhdpi devices)
- `mipmap-xxhdpi/` - 144x144 (for xxhdpi devices)
- `mipmap-xxxhdpi/` - 192x192 (for xxxhdpi devices)

Each mipmap directory contains:
- `ic_launcher.png` - Regular launcher icon
- `ic_launcher_foreground.png` - Adaptive icon foreground
- `ic_launcher_round.png` - Round launcher icon

## Files Updated
- ✅ `index.html` - Added favicon and icon links
- ✅ `public/manifest.json` - Created web app manifest
- ✅ `generate-icons.sh` - Icon generation script

## Troubleshooting

**Icons not showing in Android app?**
- Make sure you ran `npx cap sync android`
- Clean and rebuild the Android app
- Check that all mipmap directories contain the generated icons

**Favicon not showing in browser?**
- Clear your browser cache
- Do a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**ImageMagick errors?**
- Install ImageMagick: `brew install imagemagick` (Mac)
- Or use online tools to generate icons manually

