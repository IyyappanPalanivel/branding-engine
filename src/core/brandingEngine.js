// brandingEngine.js
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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

  const logoSizePx = getLogoDimensions(logoSize);
  const overlayPos = getOverlayPosition(logoPosition, logoSizePx);

  await ffmpeg.writeFile('input.mp4', videoData);
  await ffmpeg.writeFile('logo.png', logoData);

  // Scale logo
  await ffmpeg.exec([
    '-i', 'logo.png',
    '-vf', `scale=${logoSizePx}:${logoSizePx}`,
    'logo_scaled.png'
  ]);

  // Overlay logo
  await ffmpeg.exec([
    '-i', 'input.mp4',
    '-i', 'logo_scaled.png',
    '-filter_complex', `overlay=${overlayPos}`,
    'output.mp4'
  ]);

  const output = await ffmpeg.readFile('output.mp4');
  const videoBlob = new Blob([output.buffer], { type: 'video/mp4' });
  const videoURL = URL.createObjectURL(videoBlob);
  await ffmpeg.terminate();
  return videoURL;
}
