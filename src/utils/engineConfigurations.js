// Unified configuration constants
export const LOGO_SIZES = {
  small: { px: 80, preview: '50px' },
  medium: { px: 160, preview: '80px' },
  large: { px: 240, preview: '120px' }
};

export const POSITIONS = {
  'top-left': { preview: 'top-4 left-4', ffmpeg: '10:10' },
  'top-right': { preview: 'top-4 right-4', ffmpeg: 'main_w-overlay_w-10:10' },
  'bottom-left': { preview: 'bottom-4 left-4', ffmpeg: '10:main_h-overlay_h-10' },
  'bottom-right': { preview: 'bottom-4 right-4', ffmpeg: 'main_w-overlay_w-10:main_h-overlay_h-10' }
};