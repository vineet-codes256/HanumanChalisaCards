# Play Store Deployment Checklist

## ✅ Pre-Deployment Checklist

### App Configuration
- [x] Package name set: `com.hanuman.chalisa.cards`
- [x] App name: "Hanuman Chalisa Cards"
- [x] Version: 1.0.0 (versionCode: 1)
- [x] Target SDK: 36 (Android 14)
- [x] Min SDK: 24 (Android 7.0)

### Assets & Branding
- [x] App icon (all densities: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- [x] Adaptive icons (foreground + background)
- [x] Round icons (all densities)
- [x] Splash screen (high-resolution, no cropping)
- [ ] Feature Graphic (1024 x 500 px) - **REQUIRED for Play Store**
- [ ] Screenshots (minimum 2, up to 8) - **REQUIRED**
  - Phone: 1080 x 1920 px to 2400 x 4800 px
  - Recommended: 4-6 screenshots showing key features

### Technical Requirements
- [x] Internet permission (declared for Play Store link only)
- [x] Audio files included (BigBell.mp3, small-pooja-bell-fast.mp3)
- [x] Release build optimizations (minify, shrinkResources)
- [x] ProGuard rules configured
- [ ] Release keystore created - **RUN: `./generate-keystore.sh`**
- [ ] Keystore backed up securely
- [ ] Signing config enabled in build.gradle

### Legal & Policy
- [x] Privacy Policy created (PRIVACY_POLICY.md)
- [ ] Privacy Policy hosted online (required by Play Store)
  - Options: GitHub Pages, your website, or Google Sites
- [x] Play Store listing content prepared (PLAY_STORE_LISTING.md)
- [ ] Contact email ready for Play Console

### Testing
- [x] App tested on physical device
- [x] Splash screen displays correctly
- [x] All 43 verses display correctly
- [x] Audio bells work (launch + completion)
- [x] Language toggle works (Hindi ↔ Transliteration)
- [x] Navigation works (swipe, buttons, keyboard)
- [x] Rating prompt appears after last verse
- [x] Completion screen displays with ring bell button
- [ ] Test on multiple screen sizes
- [ ] Test on Android 7.0+ devices

### App Content
- [x] All Hanuman Chalisa verses complete and accurate
- [x] Hindi (Devanagari) text
- [x] English transliteration
- [x] Proper verse numbering (Opening Dohas → 40 Chaupais → Closing Doha)

---

## 📦 Building Release Bundle

### Step 1: Generate Release Keystore

```bash
./generate-keystore.sh
```

Follow the prompts to create your keystore. **SAVE THE PASSWORDS SECURELY!**

### Step 2: Configure Signing

1. Open `android/app/build.gradle`
2. Update the `signingConfigs.release` block with your keystore details:

```gradle
signingConfigs {
    release {
        storeFile file('release-keystore.jks')
        storePassword System.getenv("KEYSTORE_PASSWORD")
        keyAlias "hanuman-chalisa-release"
        keyPassword System.getenv("KEY_PASSWORD")
    }
}
```

3. Uncomment the signing line in `buildTypes.release`:

```gradle
signingConfig signingConfigs.release
```

### Step 3: Set Environment Variables

```bash
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_PASSWORD="your_key_password"
```

Or create `android/gradle.properties` (DON'T commit this):

```properties
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=hanuman-chalisa-release
KEY_PASSWORD=your_key_password
```

### Step 4: Build AAB (Android App Bundle)

```bash
cd android
./gradlew bundleRelease
```

Your signed AAB will be at:
`android/app/build/outputs/bundle/release/app-release.aab`

### Alternative: Build APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎨 Creating Required Assets

### Feature Graphic (1024 x 500 px)

Create a banner-style image with:
- Your Hanuman meditation image
- App name: "Hanuman Chalisa Cards"
- Tagline: "Divine Devotion in Your Hands"
- Use golden/saffron colors matching your app theme

Tools: Canva, Figma, Photoshop, or online banner makers

### Screenshots (Phone - Portrait)

Capture 4-6 screenshots showing:
1. **Splash/Home Screen** - First verse with app UI
2. **Hindi Text** - A chaupai in Hindi
3. **Transliteration** - Same verse in Roman script (toggle)
4. **Navigation** - Mid-chalisa showing verse counter
5. **Completion Screen** - Bell emoji with "Ring the Bell" button
6. **Rating Prompt** (optional) - 5-star rating modal

Use Android Emulator or actual device. Recommended resolution: 1080 x 1920 or higher.

Optional: Add decorative frames or descriptions using tools like:
- App Mockup Generator
- Screenshots.pro
- Previewed.app

---

## 🚀 Play Console Steps

### 1. Create App

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - App name: "Hanuman Chalisa Cards"
   - Default language: English (or Hindi)
   - App type: App
   - Free/Paid: Free
   - Declarations (follow prompts)

### 2. Store Listing

Navigate to **Store presence > Main store listing**

- Upload app icon (512 x 512 PNG)
- Upload feature graphic (1024 x 500)
- Upload screenshots (minimum 2)
- Fill in description (copy from PLAY_STORE_LISTING.md)
- Fill in short description
- Select category: Entertainment or Lifestyle
- Add contact email
- Add privacy policy URL

### 3. Content Rating

1. Go to **Policy > App content**
2. Complete the content rating questionnaire
3. Categories: Likely "Everyone" (no violence, no explicit content)
4. Submit for rating

### 4. App Pricing & Distribution

1. Go to **Policy > App availability**
2. Select countries/regions (or "All countries")
3. Confirm it's a free app
4. Review distribution agreement

### 5. Privacy Policy (REQUIRED)

Host your privacy policy online:

**Option A: GitHub Pages**
```bash
# In your repo, enable GitHub Pages
# URL will be: https://yourusername.github.io/HanumanChalisaCards/PRIVACY_POLICY.html
```

**Option B: Google Sites**
1. Go to sites.google.com
2. Create new site
3. Paste privacy policy content
4. Publish and copy URL

**Option C: Your own website**

Enter the URL in Play Console.

### 6. Upload App Bundle

1. Go to **Release > Production**
2. Click "Create new release"
3. Upload your `app-release.aab`
4. Fill in release notes:

```
Initial release of Hanuman Chalisa Cards v1.0.0

Features:
• Complete Hanuman Chalisa with all 40 verses
• Hindi (Devanagari) and English transliteration
• Devotional bell sounds
• Beautiful card-based interface
• Offline access, no ads

Jai Hanuman! 🙏
```

5. Review and roll out to production

### 7. Review & Publish

1. Complete all required sections
2. Submit for review
3. Wait for Google's approval (typically 1-7 days)
4. Once approved, app goes live!

---

## 📊 Post-Launch

### Monitor
- Check crash reports in Play Console
- Read user reviews and respond
- Monitor download statistics

### Update Version
When releasing updates:
1. Increment `versionCode` (e.g., 1 → 2)
2. Update `versionName` (e.g., "1.0.0" → "1.1.0")
3. Build new AAB
4. Create new release in Play Console
5. Add release notes describing changes

### Promote
- Share on social media
- Create QR code for offline sharing
- Ask satisfied users for reviews
- Reach out to devotional communities

---

## 🔧 Troubleshooting

**Build fails with signing error:**
- Verify keystore path is correct
- Check environment variables are set
- Ensure passwords are correct

**App rejected by Play Store:**
- Verify all required assets are uploaded
- Check privacy policy is accessible
- Review content rating accuracy
- Ensure no policy violations

**Icons look wrong:**
- Re-run `./generate-icons.sh`
- Ensure source icon is high quality (1024x1024)
- Check all mipmap folders have icons

**Audio doesn't play:**
- Verify MP3 files are in `public/assets/`
- Check file names match code exactly
- Test on actual device (not just emulator)

---

## 📞 Support

If you need help:
1. Check Play Console documentation
2. Review error messages carefully
3. Test thoroughly before submitting
4. Keep keystore and passwords secure

---

**Made with devotion. Jai Hanuman! 🚩**
