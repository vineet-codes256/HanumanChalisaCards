<div align="center">

# 🕉️ Hanuman Chalisa Cards 🙏

### *Divine Devotion in Your Hands*

<img src="public/icon-source.png" alt="Hanuman Chalisa Cards" width="200" height="200" style="border-radius: 20px; box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);"/>

**Experience the sacred 40 verses of Hanuman Chalisa**  
*in a beautiful, modern card interface*

[![Version](https://img.shields.io/badge/version-1.0.0-gold?style=for-the-badge)](package.json)
[![Platform](https://img.shields.io/badge/platform-Android-green?style=for-the-badge&logo=android)](android/)
[![License](https://img.shields.io/badge/license-Free-orange?style=for-the-badge)](LICENSE)

---

### *"जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर॥"*

</div>

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 📿 Complete Chalisa

- All 40 Chaupais
- Opening & Closing Dohas
- Verse-by-verse navigation
- Progress indicator

</td>
<td width="50%">

### 🌐 Dual Language

- Hindi (Devanagari)
- Roman transliteration
- One-tap toggle
- Clear, readable fonts

</td>
</tr>
<tr>
<td width="50%">

### 🔔 Devotional Audio

- Big bell on launch
- Small bell on completion
- Interactive ring button
- Crystal clear sound

</td>
<td width="50%">

### 🎨 Beautiful Design

- Serene mountain backdrop
- Golden & saffron theme
- Smooth card animations
- Dark, immersive UI

</td>
</tr>
</table>

<br/>

## 🚀 Quick Start

### For Developers

```bash
# Clone and install
git clone <repository-url>
cd HanumanChalisaCards
npm install

# Build and sync with Android
./build-and-sync.sh

# Or step by step
npm run build
npx cap sync android
npx cap open android
```

### Generate Custom Icons

```bash
# Place your icon at public/icon-source.png (1024x1024 recommended)
./generate-icons.sh
```

<br/>

## 🎯 Tech Stack

<div align="center">

| Technology | Purpose |
|:---:|:---|
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Lightning-fast build tool |
| ![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat&logo=capacitor&logoColor=white) | Native Android bridge |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | Core logic |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | Beautiful styling |
| ![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white) | Target platform |

</div>

<br/>

<div align="center">

## 📱 Screenshots

<div align="center" style="display: flex; flex-direction: row; justify-content: center; gap: 20px; flex-wrap: wrap;">

<img width="280" height="280" alt="Hanuman Chalisa Cards - Home Screen" src="https://github.com/user-attachments/assets/32b4b461-ab60-453f-ae35-12a1107ff252" />

<img width="280" height="280" alt="Hanuman Chalisa Cards - Closing Verse Display" src="https://github.com/user-attachments/assets/bf16863c-9b55-4fa7-8505-16f524901d9d" />

<img width="280" height="280" alt="Hanuman Chalisa Cards - Card Interface" src="https://github.com/user-attachments/assets/354baa22-cab1-412b-8166-4a89a2bee844" />

*Beautiful cards showcasing the divine interface*

</div>
</div>

<br/>

## 🔐 Release Preparation

### Step 1: Generate Keystore *(One-time only)*

```bash
./generate-keystore.sh
```

> **⚠️ CRITICAL**: Backup your keystore and save passwords securely!  
> You'll need them for all future updates. Loss means starting over.

### Step 2: Configure Signing

Edit `android/app/build.gradle`:

- Add your keystore path and credentials
- Uncomment `signingConfig signingConfigs.release`

### Step 3: Build Release

```bash
cd android
./gradlew bundleRelease
```

📦 Output: `android/app/build/outputs/bundle/release/app-release.aab`

<br/>

## 📚 Documentation

<div align="center">

| Document | Purpose |
|:---:|:---|
| 📖 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Complete Play Store submission walkthrough |
| 🎨 [PLAY_STORE_LISTING.md](PLAY_STORE_LISTING.md) | App title, description & keywords |
| 🔒 [PRIVACY_POLICY.md](PRIVACY_POLICY.md) | Privacy policy (host online for Play Store) |
| ✅ [ASSETS_TODO.md](ASSETS_TODO.md) | Required screenshots & graphics checklist |

</div>

<br/>

## 🎨 Play Store Requirements

Before submission, you'll need:

| Asset | Specifications | Status |
|:---|:---|:---:|
| Screenshots | 2-8 images, 1080×1920 px | ⏳ Pending |
| Feature Graphic | 1024×500 px banner | ⏳ Pending |
| Privacy Policy | Hosted online URL | 📄 Created |
| App Icon | 512×512 px | ✅ Generated |
| Contact Email | For Play Console | ⏳ Required |

> See [ASSETS_TODO.md](ASSETS_TODO.md) for detailed guidelines

<br/>

## 📦 Version Info

<table align="center">
<tr>
<td align="center"><strong>Version</strong></td>
<td align="center"><strong>Version Code</strong></td>
<td align="center"><strong>Package ID</strong></td>
</tr>
<tr>
<td align="center"><code>1.0.0</code></td>
<td align="center"><code>1</code></td>
<td align="center"><code>com.hanuman.chalisa.cards</code></td>
</tr>
<tr>
<td align="center"><strong>Target SDK</strong></td>
<td align="center"><strong>Min SDK</strong></td>
<td align="center"><strong>Platform</strong></td>
</tr>
<tr>
<td align="center"><code>36</code> (Android 14)</td>
<td align="center"><code>24</code> (Android 7.0)</td>
<td align="center">Android</td>
</tr>
</table>

<br/>

## 🛠️ Available Scripts

```bash
./generate-icons.sh         # Generate all app icons from source
./generate-keystore.sh      # Create release signing keystore
./build-and-sync.sh         # Build web app & sync with Android
```

<br/>

## 📋 Deployment Checklist

- [x] ✅ App code complete and tested
- [x] ✅ Icons generated (all densities)
- [x] ✅ Splash screen optimized
- [x] ✅ Audio bells implemented
- [x] ✅ Version set to 1.0.0
- [x] ✅ Build configuration ready
- [x] ✅ Documentation complete
- [ ] ⏳ Release keystore generated
- [ ] ⏳ Screenshots captured
- [ ] ⏳ Feature graphic designed
- [ ] ⏳ Privacy policy hosted
- [ ] ⏳ Play Console submission

<br/>

## 🎯 Roadmap

### Current Version (1.0.0)

- ✅ Complete Hanuman Chalisa (43 verses)
- ✅ Hindi & English transliteration
- ✅ Devotional bell sounds
- ✅ Beautiful card UI
- ✅ Offline support

### Future Enhancements

- 🔮 Audio recitation
- 🔮 Verse meanings
- 🔮 Bookmark favorite verses
- 🔮 Daily notification reminders
- 🔮 Multiple language support
- 🔮 Share verses as images

<br/>

<div align="center">

## 🙏 Devotion & Credits

*This app is created with devotion for all Hanuman devotees worldwide*

### Sacred Text

Original Hanuman Chalisa composed by **Goswami Tulsidas**

### Built With Love

Modern web technologies & spiritual dedication

---

### *May Lord Hanuman bless all users with strength, wisdom, and devotion* 🚩

**Jai Hanuman! Jai Shri Ram!** 🙏

<br/>

<sub>Made with 🧡 for devotees | Open for spiritual contributions</sub>

</div>

<br/>

---

<div align="center">

**🔔 Ring the bell of devotion | 📿 One verse at a time**

</div>
