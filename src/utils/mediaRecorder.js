/**
 * Media Recorder Utilities
 * Helper functions for video recording functionality
 */

/**
 * Get media stream from user's camera and microphone
 * @param {Object} constraints - MediaStream constraints
 * @returns {Promise<MediaStream>}
 */
export async function getMediaStream(constraints = {}) {
  const defaultConstraints = {
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      facingMode: 'user'
    },
    audio: true
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      ...defaultConstraints,
      ...constraints
    });
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw new Error(getMediaErrorMessage(error));
  }
}

/**
 * Get user-friendly error message for media access errors
 * @param {Error} error - MediaStream error
 * @returns {string}
 */
function getMediaErrorMessage(error) {
  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return 'Camera/microphone access denied. Please allow permissions in your browser settings.';
  }
  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return 'No camera or microphone found. Please connect a device and try again.';
  }
  if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    return 'Camera/microphone is already in use by another application.';
  }
  return `Unable to access camera/microphone: ${error.message}`;
}

/**
 * Detect the best supported MIME type for video recording
 * @returns {string}
 */
export function getSupportedMimeType() {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/webm',
    'video/mp4'
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return 'video/webm'; // Fallback
}

/**
 * Convert Blob to File with proper metadata
 * @param {Blob} blob - Video blob from MediaRecorder
 * @param {string} filename - Desired filename
 * @returns {File}
 */
export function blobToFile(blob, filename = null) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const extension = blob.type.includes('webm') ? 'webm' : 'mp4';
  const name = filename || `recorded-video-${timestamp}.${extension}`;
  
  return new File([blob], name, {
    type: blob.type,
    lastModified: Date.now()
  });
}

/**
 * Format recording time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string}
 */
export function formatRecordingTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Get list of available media devices
 * @returns {Promise<Object>}
 */
export async function getAvailableDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      videoInputs: devices.filter(device => device.kind === 'videoinput'),
      audioInputs: devices.filter(device => device.kind === 'audioinput')
    };
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return { videoInputs: [], audioInputs: [] };
  }
}

/**
 * Stop all tracks in a media stream
 * @param {MediaStream} stream - Media stream to stop
 */
export function stopMediaStream(stream) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}
