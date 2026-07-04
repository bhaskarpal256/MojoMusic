# 🎵 MojoMusic

MojoMusic is an elegant, high-fidelity music streaming dashboard built with React.js and Redux Toolkit. It communicates with the iTunes API to play track previews, display charts, query detailed song/artist profiles, and support full search capabilities. 

This repository features state-of-the-art enhancements, including interactive canvas audio visualizers, a custom multi-theme builder, global hotkey controls, and a fully responsive layout optimized for mobile viewports.

---

## ✨ Features

### 🌌 1. Interactive Audio Visualizers
MojoMusic includes a dual-layered visualizer engine that reacts to active song playback and volume levels:
* **Ambient wave**: A subtle, elegant sine-wave animation that flows in the background of the bottom player bar.
* **Visualizer Overlay**: A full-screen visualization panel toggled by clicking the wave icon, offering three styles:
  * **Circular Ripple**: Bounces outer rings in sync with the beat around a rotating vinyl record showing the track's artwork.
  * **Frequency Bars**: A classic graphic equalizer bar configuration.
  * **Cosmic Particles**: A responsive particle field that moves and expands based on volume levels.

### 🎨 2. App Theme Customizer
Transform the visual style of the application instantly with the theme selector in the Sidebar. Each theme adapts the background gradient, sidebar, search focus border, buttons, and visualizer highlights:
* **Deep Blue (Default)**: Sleek indigo-black backdrop with cyan highlights.
* **Cyberpunk Neon**: High-contrast dark violet setting with neon fuchsia glows.
* **Sunset Peach**: Warm crimson and dark amber twilight aesthetics.
* **Forest Emerald**: A deep green, organic midnight setting.
* **Midnight Ebony**: A clean carbon-black dark mode with silver borders.

### ⌨️ 3. Global Keyboard Shortcuts & Guide
Control your music hands-free from anywhere on the page:
* `Space` — Play / Pause track
* `Arrow Left` / `Arrow Right` — Seek backward / forward by 5s
* `Arrow Up` / `Arrow Down` — Adjust volume level (+/- 5%)
* `M` / `m` — Mute / Unmute audio
* `N` / `n` — Skip to the next song
* `P` / `p` — Return to the previous song
* `L` / `l` — Toggle the song's liked/favorite state
* `?` / `H` / `h` — Open the floating Keyboard Shortcuts Guide modal

*Note: Keyboard hotkeys are intelligently bypassed when you are typing inside the Searchbar or any other text input.*

---

## 🛠️ Tech Stack

* **Framework**: React.js (v18)
* **Build Tool**: Vite (v2)
* **State Management**: Redux Toolkit & RTK Query
* **Styling**: Tailwind CSS & Autoprefixer
* **Icons**: React Icons (Fi, Bs, Ri, Hi, Md)
* **Additional Libraries**: Axios (Location check/Around You), Swiper (Top Artists carousel)

---

## 🚀 Getting Started

### System Requirements
* **Node.js** v16.15.1 or higher
* **npm** v5.6.1 or higher

### Installation & Run

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/bhaskarpal256/MojoMusic.git
   cd MojoMusic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) or check the terminal output for the local port configuration.

---

## 📁 Project Structure

```text
src/
├── assets/             # Logo, loader graphics, and theme/menu constants
├── components/         # Modular components (Sidebar, Searchbar, SongCard, etc.)
│   └── MusicPlayer/    # Playback control components & Visualizer overlays
├── pages/              # Main page views (Discover, AroundYou, TopCharts, Favorites, etc.)
├── redux/              # Redux slices and RTK query service configurations
├── index.css           # Global CSS styles and Tailwind configurations
└── App.jsx             # Main routing and global shortcut handlers
```
