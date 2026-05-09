# Kinnovance AI — React + Vite

A modern, high-performance website for Kinnovance AI built with **Vite** and **React**, featuring advanced Three.js particle animations, smooth scrolling, and component-based architecture.

## 📋 Project Structure

```
src/
├── components/           # React components
│   ├── Navbar.jsx
│   ├── Background.jsx
│   ├── Hero.jsx          # Main hero section
│   ├── HeroTitle.jsx
│   ├── HeroSubtitle.jsx
│   ├── HeroCTA.jsx
│   ├── Chips.jsx
│   ├── Stats.jsx
│   ├── HUDLabels.jsx
│   ├── ScrollHint.jsx
│   ├── ParticleScene.jsx # Three.js particles
│   ├── NextSection.jsx
│   └── index.js
├── styles/              # CSS modules (organized by section)
│   ├── index.css
│   ├── global.css
│   ├── background.css
│   ├── navbar.css
│   ├── buttons.css
│   ├── hero.css
│   ├── animations.css
│   └── responsive.css
├── theme.js             # Centralized theme configuration
├── App.jsx              # Root component
└── main.jsx             # Entry point

index.html              # HTML template
vite.config.js          # Vite configuration
package.json            # Dependencies
```

## 🎨 Theme Configuration

All design tokens are centralized in `src/theme.js`:

- **Colors**: Gradients, primary colors, semantic colors
- **Spacing**: Radius, gaps, dimensions
- **Easing**: Animation functions
- **Particle Settings**: Three.js particle configuration
- **Bloom Effects**: Post-processing settings

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will open at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 📦 Key Dependencies

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Three.js** - 3D graphics library for particles
- **GSAP** - Animation library
- **Lenis** - Smooth scrolling

## 🎯 Component Architecture

### Main Components
- **Navbar** - Navigation bar with branding
- **Background** - Grid, glows, brand text background
- **ParticleScene** - Three.js particle cloud with mouse interaction
- **Hero** - Main hero section combining all hero elements
- **NextSection** - Secondary content section

### Sub-Components
- **Eyebrow** - "Introducing" badge
- **HeroTitle** - Animated gradient title
- **HeroSubtitle** - Description text
- **HeroCTA** - Call-to-action buttons
- **Chips** - Feature tags
- **Stats** - Metrics display
- **HUDLabels** - Corner status badges
- **ScrollHint** - Scroll indicator

## 🎬 Animations

All animations are controlled via:
- **GSAP** - Timeline-based entrance animations
- **CSS Animations** - Continuous effects (breathing, drifting)
- **Shader Animations** - Noise-based particle deformation
- **Lenis** - Smooth scroll physics

## ✨ Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth scroll with Lenis
- ✅ GPU-accelerated particles (Three.js + WebGL)
- ✅ Interactive mouse tracking on particles
- ✅ Bloom post-processing effect
- ✅ Organized modular CSS
- ✅ Centralized theme configuration
- ✅ Component-based architecture

## 🔧 Customization

### Modify Theme
Edit `src/theme.js` to change colors, sizes, and animations.

### Update Particles
Particle settings are in `theme.particles` and `theme.dust` configurations.

### Add New Sections
1. Create a new component in `src/components/`
2. Add styling in `src/styles/`
3. Import and use in `App.jsx`

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with WebGL support

## 📝 License

All rights reserved - Kinnovance AI
