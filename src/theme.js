// Theme configuration with all CSS variables and styling constants
export const theme = {
  colors: {
    bg: '#050816',
    bgSecondary: '#07091b',
    ink: '#e8ecff',
    inkDim: '#a6aec9',
    inkMute: '#6c748f',
    line: 'rgba(255, 255, 255, 0.08)',
    lineStrong: 'rgba(255, 255, 255, 0.14)',
    cyan: '#00d1ff',
    cyanBright: '#00f5ff',
    violet: '#6c5ce7',
    white: '#ffffff',
    cyanTeal: '#2dd4bf',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00d1ff 0%, #6c5ce7 60%, #00f5ff 100%)',
    text: 'linear-gradient(100deg, #ffffff 0%, #a8c7ff 30%, #00f5ff 55%, #b5a8ff 80%, #ffffff 100%)',
    brandBg: 'linear-gradient(120deg, rgba(0, 209, 255, 0.18) 0%, rgba(108, 92, 231, 0.22) 40%, rgba(0, 245, 255, 0.15) 70%, rgba(108, 92, 231, 0.20) 100%)',
  },
  spacing: {
    radius: '14px',
    radiusLg: '20px',
    navHeight: '74px',
  },
  easing: {
    default: 'cubic-bezier(0.22, 1, 0.36, 1)',
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  particles: {
    count: 13500,
    baseRadius: 1.9,
    cloudX: 2.7,
    cloudY: 1.9,
    size: 18,
    noiseStrength: 1.0,
    waveStrength: 0.22,
    mouseStrength: 0.35,
  },
  dust: {
    count: 400,
  },
  bloom: {
    threshold: 0.18,
    strength: 0.28,
    radius: 0.35,
  },
};

export const cssVariables = `
:root {
  --bg: ${theme.colors.bg};
  --bg-2: ${theme.colors.bgSecondary};
  --ink: ${theme.colors.ink};
  --ink-dim: ${theme.colors.inkDim};
  --ink-mute: ${theme.colors.inkMute};
  --line: ${theme.colors.line};
  --line-strong: ${theme.colors.lineStrong};

  --c-cyan: ${theme.colors.cyan};
  --c-cyan-2: ${theme.colors.cyanBright};
  --c-violet: ${theme.colors.violet};
  --c-white: ${theme.colors.white};

  --grad-primary: ${theme.gradients.primary};
  --grad-text: ${theme.gradients.text};
  --grad-brand-bg: ${theme.gradients.brandBg};

  --radius: ${theme.spacing.radius};
  --radius-lg: ${theme.spacing.radiusLg};

  --ease: ${theme.easing.default};
  --ease-out: ${theme.easing.out};

  --nav-h: ${theme.spacing.navHeight};
}
`;

export default theme;
