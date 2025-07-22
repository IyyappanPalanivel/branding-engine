import { FFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = new FFmpeg();

export const loadFFmpeg = async () => {
  //if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  //}
  return ffmpeg;
};

export const getProgressLogger = (setProgressValue) => {
  return ({ ratio }) => {
    const percent = Math.min(100, Math.round(ratio * 100));
    setProgressValue(percent);
  };
};

export const saveFileToURL = async (ffmpeg, outputName) => {
  const data = ffmpeg.FS('readFile', outputName);
  const blob = new Blob([data.buffer], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
};