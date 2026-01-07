# Hanuman Chalisa Cards - Play Store Assets TODO

This document tracks the remaining assets needed for Play Store submission.

## ✅ Completed Assets

- [x] App icon (512x512 PNG) - Generated via `generate-icons.sh`
- [x] All density icons (mdpi through xxxhdpi)
- [x] Adaptive icons (foreground + background)
- [x] Round launcher icons
- [x] Splash screen (high-res, padded)

## 📸 Screenshots Required (Minimum 2, Maximum 8)

**Recommended: 4-6 screenshots**

Resolution: 1080 x 1920 (or 1080 x 2340 for modern phones)

### Suggested Screenshots:

1. **Opening Verse** - Shows splash/first doha with beautiful UI
2. **Hindi Text Mode** - A chaupai displaying Hindi (Devanagari) text
3. **Transliteration Mode** - Same verse with language toggle (Roman text)
4. **Mid-Chalisa** - Shows verse counter (e.g., "20 / 43")
5. **Completion Screen** - Bell emoji and "Ring the Bell" button
6. **Rating Prompt** (optional) - The 5-star rating modal

### How to Capture:

**Option A: Android Emulator**
1. Open Android Studio
2. Run app on Pixel emulator
3. Use emulator's screenshot tool
4. Or use: `adb shell screencap -p /sdcard/screenshot.png && adb pull /sdcard/screenshot.png`

**Option B: Physical Device**
1. Install app on your phone
2. Take screenshots (Power + Volume Down)
3. Transfer to computer via USB or cloud

**Option C: Use Android Studio**
1. Run app in Android Studio
2. Use "Screen Record" or "Screenshot" button in Run panel

### Optional Enhancement:
Add frames/descriptions using:
- [App Mockup](https://app-mockup.com/)
- [Screenshots.pro](https://screenshots.pro/)
- [Previewed.app](https://previewed.app/)

## 🎨 Feature Graphic Required

**Dimensions: 1024 x 500 pixels**

The feature graphic appears at the top of your Play Store listing.

### Design Requirements:
- 1024 x 500 px PNG or JPEG
- 72 dpi or higher
- Maximum 1 MB file size
- No transparency

### Suggested Design:

**Layout:**
```
┌────────────────────────────────────────────────┐
│                                                │
│  [Hanuman Icon]   Hanuman Chalisa Cards       │
│  (on left)        हनुमान चालीसा                │
│                   Divine Devotion in Cards     │
│                                                │
└────────────────────────────────────────────────┘
```

**Elements:**
- Background: Dark red/maroon gradient (matching app theme)
- Left side: Your Hanuman meditation image (circular or rounded square)
- Center/Right: App name in English + Hindi
- Tagline: "Divine Devotion in Your Hands" or "40 Verses of Strength"
- Use golden (#FFD700) and saffron (#FF9933) colors
- Optional: Subtle mountain silhouette background

### Tools to Create:

**Free:**
- [Canva](https://canva.com) - Use "YouTube Thumbnail" template (close to 1024x500)
- [Figma](https://figma.com) - Design from scratch
- [GIMP](https://gimp.org) - Free Photoshop alternative

**Paid:**
- Adobe Photoshop
- Affinity Designer

### Template Dimensions in Design Tool:
- Width: 1024 px
- Height: 500 px
- Resolution: 72 ppi

## 📧 Additional Info Needed

- [ ] Contact email for Play Console (required)
- [ ] Privacy Policy hosted URL (required)
  - Host PRIVACY_POLICY.md at:
    - GitHub Pages: `https://yourusername.github.io/HanumanChalisaCards/PRIVACY_POLICY.html`
    - Google Sites: Create a simple site
    - Your own website
- [ ] Optional: App website URL

## 🚀 Quick Asset Checklist

Before submitting to Play Store, ensure you have:

- [ ] 2-8 screenshots (1080 x 1920 or higher)
- [ ] Feature graphic (1024 x 500)
- [ ] High-res icon (512 x 512) ✅ Already generated
- [ ] Privacy policy URL
- [ ] Contact email
- [ ] App description (ready in PLAY_STORE_LISTING.md) ✅
- [ ] Release AAB signed with keystore

## 📝 Notes

Once you have screenshots and feature graphic:
1. Upload to Play Console under "Store presence > Main store listing"
2. For screenshots, upload to "Phone" section
3. Feature graphic goes in the "Graphic assets" section

---

**Status**: Waiting for screenshots and feature graphic creation
**Priority**: High (required for Play Store submission)
