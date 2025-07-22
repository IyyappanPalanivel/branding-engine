// brandingEngine.js
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

async function createNameCardImage(customerName, customerRole, brandColor) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = 600;
  const height = 150;

  canvas.width = width;
  canvas.height = height;

  // Background
  ctx.fillStyle = brandColor || '#000';
  ctx.fillRect(0, 0, width, height);

  // Text - Name
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(customerName, 20, 60);

  // Text - Role
  ctx.font = '24px Arial';
  ctx.fillText(customerRole, 20, 110);

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
}

const getLogoDimensions = (size) => {
  switch (size) {
    case 'small': return 80;
    case 'medium': return 160;
    case 'large': return 240;
    default: return 160;
  }
};

const getOverlayPosition = (position, logoSize) => {
  switch (position) {
    case 'top-left': return `10:10`;
    case 'top-right': return `main_w-${logoSize + 10}:10`;
    case 'bottom-left': return `10:main_h-${logoSize + 10}`;
    case 'bottom-right': return `main_w-${logoSize + 10}:main_h-${logoSize + 10}`;
    default: return `10:10`;
  }
};

export async function brandTestimonialVideo({
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
  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', ({ message }) => setLogs((prev) => [...prev, message]));
  ffmpeg.on('progress', ({ progress }) => setProgressValue(Math.round(progress * 100)));

  await ffmpeg.load();
  setLogs((prev) => [...prev, 'FFmpeg loaded']);

  const videoData = await fetchFile(videoFile);
  const logoData = await fetchFile(logoFile);
  const nameCardBlob = await createNameCardImage(customerName, customerRole, brandColor);
  const nameCardArrayBuffer = await nameCardBlob.arrayBuffer();

  const logoSizePx = getLogoDimensions(logoSize);
  const overlayPos = getOverlayPosition(logoPosition, logoSizePx);
  const nameCardPos = `10:main_h-overlay_h-20`; // bottom-left with margin

  await ffmpeg.writeFile('input.mp4', videoData);
  await ffmpeg.writeFile('logo.png', logoData);
  await ffmpeg.writeFile('name_card.png', new Uint8Array(nameCardArrayBuffer));

  // Scale logo
  await ffmpeg.exec([
    '-i', 'logo.png',
    '-vf', `scale=${logoSizePx}:${logoSizePx}`,
    'logo_scaled.png'
  ]);

  // Overlay logo and name card
  await ffmpeg.exec([
    '-i', 'input.mp4',
    '-i', 'logo_scaled.png',
    '-i', 'name_card.png',
    '-filter_complex',
    `[0:v][1:v]overlay=${overlayPos}[tmp];[tmp][2:v]overlay=${nameCardPos}`,
    '-c:a', 'copy',
    'output.mp4'
  ]);

  const output = await ffmpeg.readFile('output.mp4');
  const videoBlob = new Blob([output.buffer], { type: 'video/mp4' });
  const videoURL = URL.createObjectURL(videoBlob);

  await ffmpeg.terminate();
  return videoURL;
}
