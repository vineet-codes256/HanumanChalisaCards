# Alternative Audio Sources

Since the original bell audio files are not included due to licensing, here are suggestions for sourcing replacement sounds:

## 🔔 Finding Bell Sound Effects

### Free & Open Source Options

1. **Freesound.org** (Creative Commons licensed)
   - Search: "temple bell", "pooja bell", "meditation bell"
   - Filter by CC0 (Public Domain) or CC-BY licenses
   - Download and rename appropriately

2. **OpenGameArt.org**
   - Search: "bell sound effect"
   - Look for CC0 or CC-BY licensed sounds

3. **Pixabay Audio Library**
   - [pixabay.com/sound-effects](https://pixabay.com/sound-effects)
   - Search: "bell", "chime", "gong"
   - All sounds are free for commercial use

4. **Zapsplat** (Free tier available)
   - [zapsplat.com](https://www.zapsplat.com)
   - Large collection of free sound effects
   - Attribution may be required

### Recording Your Own

- Visit a local temple and ask permission to record
- Use a smartphone with a good microphone
- Record in a quiet environment
- Format: MP3, mono or stereo, 128-192 kbps

## 📁 File Specifications

### BigBell.mp3
- **Purpose**: Plays on app launch during splash screen
- **Duration**: 2-4 seconds recommended
- **Sound**: Deep, resonant temple bell or gong
- **Volume**: Medium to loud

### small-pooja-bell-fast.mp3
- **Purpose**: Plays when Chalisa is completed
- **Duration**: 3-6 seconds
- **Sound**: Light, quick bell ring (like a handheld pooja bell)
- **Volume**: Medium

## 🛠️ Adding Audio Files

Once you have your audio files:

1. Place them in `public/assets/`
2. Name them exactly:
   - `BigBell.mp3`
   - `small-pooja-bell-fast.mp3`
3. The app will automatically use them

## 🎵 Placeholder/Silence Option

If you want the app to run without audio:

```javascript
// In src/main.js, comment out or modify these lines:
// bigBellAudio.play().catch(() => {});
// smallBellAudio.play().catch(() => {});
```

Or create silent MP3 files (1 second of silence) as placeholders.

## 📝 Attribution

If you use CC-BY licensed sounds, add attribution to CREDITS.md:

```markdown
### Bell Sound Effects
- BigBell.mp3: "Temple Bell" by [Artist Name] - CC-BY 3.0
  Source: [URL]
- small-pooja-bell-fast.mp3: "Hand Bell" by [Artist Name] - CC-BY 3.0
  Source: [URL]
```

---

**Recommendation**: Use CC0 (public domain) sounds to avoid attribution requirements and keep the app simple.
