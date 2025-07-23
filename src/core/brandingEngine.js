import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Unified configuration constants
const LOGO_SIZES = {
  small: { px: 80, preview: '50px' },
  medium: { px: 160, preview: '80px' },
  large: { px: 240, preview: '120px' }
};

const POSITIONS = {
  'top-left': { preview: 'top-4 left-4', ffmpeg: '10:10' },
  'top-right': { preview: 'top-4 right-4', ffmpeg: 'main_w-overlay_w-10:10' },
  'bottom-left': { preview: 'bottom-4 left-4', ffmpeg: '10:main_h-overlay_h-10' },
  'bottom-right': { preview: 'bottom-4 right-4', ffmpeg: 'main_w-overlay_w-10:main_h-overlay_h-10' }
};

// Name card configuration - scaled for video resolution
const NAME_CARD_CONFIG = {
  width: 480,
  height: 120,
  padding: 24,
  margin: 20,
  borderRadius: 12,
  fonts: {
    name: { size: 28, weight: 'bold' },
    role: { size: 18, weight: 'normal' }
  }
};

// Optimized branding engine with rounded corners
async function createNameCardImage(customerName, customerRole, brandColor) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height, padding, borderRadius, fonts } = NAME_CARD_CONFIG;

  canvas.width = width;
  canvas.height = height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Create rounded rectangle background
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, borderRadius);
  ctx.fillStyle = brandColor || '#000';
  ctx.fill();

  // Text styling
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top';

  // Customer name
  ctx.font = `${fonts.name.weight} ${fonts.name.size}px Arial, sans-serif`;
  const nameY = padding;
  ctx.fillText(customerName, padding, nameY);

  // Customer role
  ctx.font = `${fonts.role.weight} ${fonts.role.size}px Arial, sans-serif`;
  const roleY = nameY + fonts.name.size + 6;
  ctx.fillText(customerRole, padding, roleY);

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
}

function getOverlayPosition(position, logoSize) {
  const basePos = POSITIONS[position]?.ffmpeg || POSITIONS['top-right'].ffmpeg;
  return basePos.replace('overlay_w', LOGO_SIZES[logoSize].px);
}

export default async function brandTestimonialVideo({
  videoFile,
  logoFile,
  customerName,
  customerRole,
  brandColor,
  logoPosition,
  logoSize,
  setProgressValue,
  setLogs,
}) {
  try {
    // Dynamic import for FFmpeg
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();
    
    // Enhanced logging
    ffmpeg.on('log', ({ message }) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    });
    
    ffmpeg.on('progress', ({ progress }) => {
      const percentage = Math.round(progress * 100);
      setProgressValue(percentage);
    });

    setLogs(prev => [...prev, 'Initializing FFmpeg...']);
    await ffmpeg.load();
    setLogs(prev => [...prev, 'FFmpeg loaded successfully']);

    // Process files
    setLogs(prev => [...prev, 'Processing video file...']);
    const videoData = await fetchFile(videoFile);
    
    setLogs(prev => [...prev, 'Processing logo file...']);
    const logoData = await fetchFile(logoFile);
    
    setLogs(prev => [...prev, 'Creating name card...']);
    const nameCardBlob = await createNameCardImage(customerName, customerRole, brandColor);
    const nameCardArrayBuffer = await nameCardBlob.arrayBuffer();

    // Write files to FFmpeg
    await ffmpeg.writeFile('input.mp4', videoData);
    await ffmpeg.writeFile('logo.png', logoData);
    await ffmpeg.writeFile('name_card.png', new Uint8Array(nameCardArrayBuffer));

    const logoSizePx = LOGO_SIZES[logoSize].px;
    const logoOverlayPos = getOverlayPosition(logoPosition, logoSize);
    const nameCardPos = `10:main_h-overlay_h-${NAME_CARD_CONFIG.margin}`;

    setLogs(prev => [...prev, `Scaling logo to ${logoSizePx}x${logoSizePx}...`]);
    await ffmpeg.exec([
      '-i', 'logo.png',
      '-vf', `scale=${logoSizePx}:${logoSizePx}:force_original_aspect_ratio=decrease`,
      'logo_scaled.png'
    ]);

    setLogs(prev => [...prev, 'Applying overlays to video...']);
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-i', 'logo_scaled.png',
      '-i', 'name_card.png',
      '-filter_complex',
      `[0:v][1:v]overlay=${logoOverlayPos}[tmp];[tmp][2:v]overlay=${nameCardPos}`,
      '-c:a', 'copy',
      '-y',
      'output.mp4'
    ]);

    setLogs(prev => [...prev, 'Generating final video...']);
    const output = await ffmpeg.readFile('output.mp4');
    const videoBlob = new Blob([output.buffer], { type: 'video/mp4' });
    const videoURL = URL.createObjectURL(videoBlob);

    await ffmpeg.terminate();
    setLogs(prev => [...prev, 'Video processing complete!']);
    return videoURL;

  } catch (error) {
    setLogs(prev => [...prev, `Error: ${error.message}`]);
    throw error;
  }
}