// Branding Engine Configuration
import { LOGO_SIZES, POSITIONS } from '../utils/engineConfigurations';

// -------------------------
// 📐 Get FFmpeg overlay position string for logo
// -------------------------
function getLogoOverlayPosition(position, size) {
  const basePosition = POSITIONS[position]?.ffmpeg || POSITIONS['top-right'].ffmpeg;
  return basePosition.replace('overlay_w', LOGO_SIZES[size].px);
}

// Name Card Configuration
const NAME_CARD_CONFIG = {
  maxWidth: 480,
  height: 120,
  padding: 24,
  margin: 20,
  borderRadius: 12,
  fonts: {
    name: { size: 28, weight: 'bold' },
    role: { size: 18, weight: 'normal' },
  },
};

// -------------------------
// 🔧 Compute dynamic width for name card
// -------------------------
function computeNameCardWidth(name, role) {
  const baseWidth = 200 + name.length * 10 + role.length * 6;
  return Math.min(baseWidth, NAME_CARD_CONFIG.maxWidth);
}

// -------------------------
// 🖼️ Create name card as canvas PNG
// -------------------------
async function createNameCardImage(name, role, color) {
  const width = computeNameCardWidth(name, role);
  const height = NAME_CARD_CONFIG.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  // Draw rounded background
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, NAME_CARD_CONFIG.borderRadius);
  ctx.fillStyle = color || '#000';
  ctx.fill();

  // Text styles
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top';

  ctx.font = `${NAME_CARD_CONFIG.fonts.name.weight} ${NAME_CARD_CONFIG.fonts.name.size}px Arial`;
  ctx.fillText(name, NAME_CARD_CONFIG.padding, NAME_CARD_CONFIG.padding);

  ctx.font = `${NAME_CARD_CONFIG.fonts.role.weight} ${NAME_CARD_CONFIG.fonts.role.size}px Arial`;
  const roleY = NAME_CARD_CONFIG.padding + NAME_CARD_CONFIG.fonts.name.size + 6;
  ctx.fillText(role, NAME_CARD_CONFIG.padding, roleY);

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
}

// -------------------------
// 🚀 Main Branding Engine
// -------------------------
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
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({ message }) => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    });

    ffmpeg.on('progress', ({ progress }) => {
      setProgressValue(Math.round(progress * 100));
    });

    setLogs((prev) => [...prev, 'Loading FFmpeg...']);
    await ffmpeg.load();
    setLogs((prev) => [...prev, 'FFmpeg loaded.']);

    const videoData = await fetchFile(videoFile);
    const logoData = await fetchFile(logoFile);

    setLogs((prev) => [...prev, 'Creating name card...']);
    const nameCardBlob = await createNameCardImage(customerName, customerRole, brandColor);
    const nameCardBuffer = await nameCardBlob.arrayBuffer();

    await ffmpeg.writeFile('input.mp4', videoData);
    await ffmpeg.writeFile('logo.png', logoData);
    await ffmpeg.writeFile('name_card.png', new Uint8Array(nameCardBuffer));

    const logoPx = LOGO_SIZES[logoSize].px;
    const logoOverlay = getLogoOverlayPosition(logoPosition, logoSize);
    const nameCardOverlay = `'if(lt(t,1), W, 10)':'main_h-overlay_h-${NAME_CARD_CONFIG.margin}'`;

    setLogs((prev) => [...prev, `Scaling logo to ${logoPx}x${logoPx}`]);
    await ffmpeg.exec([
      '-i', 'logo.png',
      '-vf', `scale=${logoPx}:${logoPx}:force_original_aspect_ratio=decrease`,
      'logo_scaled.png',
    ]);

    setLogs((prev) => [...prev, 'Applying overlays to video...']);
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-i', 'logo_scaled.png',
      '-i', 'name_card.png',
      '-filter_complex',
      `[0:v][1:v]overlay=${logoOverlay}[tmp];[tmp][2:v]overlay=${nameCardOverlay}`,
      '-c:a', 'copy',
      '-y',
      'output.mp4',
    ]);

    const output = await ffmpeg.readFile('output.mp4');
    const finalBlob = new Blob([output.buffer], { type: 'video/mp4' });
    const videoURL = URL.createObjectURL(finalBlob);

    await ffmpeg.terminate();
    setLogs((prev) => [...prev, '✅ Video branding complete!']);

    return videoURL;
  } catch (err) {
    setLogs((prev) => [...prev, `❌ Error: ${err.message}`]);
    throw err;
  }
}