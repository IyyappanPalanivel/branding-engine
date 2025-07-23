import React, { useState, useEffect, useMemo, useCallback } from 'react';
import brandTestimonialVideo from './core/brandingEngine';
import { LOGO_SIZES, POSITIONS } from './utils/engineConfigurations';
import LogsPanel from './components/LogsPanel';
import LeftPanel from './components/LeftPanel';

export default function BrandingEngineUI() {
  const [videoFile, setVideoFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [customerName, setCustomerName] = useState('Millie');
  const [customerRole, setCustomerRole] = useState('Marketing Manager');
  const [brandColor, setBrandColor] = useState('#1DA1F2');
  const [logoPosition, setLogoPosition] = useState('top-right');
  const [logoSize, setLogoSize] = useState('medium');
  const [videoPreview, setVideoPreview] = useState(null);
  const [rawVideoURL, setRawVideoURL] = useState(null);
  const [logoPreviewURL, setLogoPreviewURL] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoized values for performance
  const logoPositionClass = useMemo(() =>
    POSITIONS[logoPosition]?.preview || POSITIONS['top-right'].preview,
    [logoPosition]
  );

  const logoSizeStyle = useMemo(() =>
    LOGO_SIZES[logoSize]?.preview || LOGO_SIZES.medium.preview,
    [logoSize]
  );

  // Handle video file change
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setRawVideoURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  // Handle logo file change
  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      setLogoPreviewURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [logoFile]);

  const handleRender = useCallback(async () => {
    if (!videoFile || !logoFile) {
      alert('Please upload both video and logo files first');
      return;
    }

    setIsProcessing(true);
    setVideoPreview(null);
    setProgress(0);
    setLogs(['Starting video processing...']);

    try {
      const result = await brandTestimonialVideo({
        videoFile,
        logoFile,
        customerName,
        customerRole,
        brandColor,
        logoPosition,
        logoSize,
        setProgressValue: setProgress,
        setLogs,
      });
      setVideoPreview(result);
    } catch (error) {
      setLogs(prev => [...prev, `Processing failed: ${error.message}`]);
    } finally {
      setIsProcessing(false);
    }
  }, [videoFile, logoFile, customerName, customerRole, brandColor, logoPosition, logoSize]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return (
    <div className="flex flex-row w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans overflow-hidden">
      {/* Left Configuration Panel */}
      <LeftPanel {...{ videoFile, logoFile, setVideoFile, setLogoFile, customerName, setCustomerName, customerRole, setCustomerRole, brandColor, setBrandColor, logoPosition, setLogoPosition, logoSize, setLogoSize, isProcessing, handleRender, progress }} />

      {/* Right Section */}
      <RightPanel {...{ videoPreview, rawVideoURL, logoPreviewURL, logoPositionClass, logoSizeStyle, brandColor, customerName, customerRole, logs, clearLogs }} />
    </div>
  );
}

function RightPanel({ videoPreview, rawVideoURL, logoPreviewURL, logoPositionClass, logoSizeStyle, brandColor, customerName, customerRole, logs, clearLogs }) {
  return (
    <div className="flex flex-col flex-1 p-6 space-y-6">
      <PreviewPanel {...{ videoPreview, rawVideoURL, logoPreviewURL, logoPositionClass, logoSizeStyle, brandColor, customerName, customerRole }} />
      <LogsPanel {...{ logs, clearLogs }} />
    </div>
  );
}

{/* Video display + overlays */ }
function PreviewPanel({ videoPreview, rawVideoURL, logoPreviewURL, logoPositionClass, logoSizeStyle, brandColor, customerName, customerRole }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">🔍 Live Preview</h2>
        {videoPreview && (
          <a
            href={videoPreview}
            download="branded-testimonial.mp4"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            📥 Download Video
          </a>
        )}
      </div>

      <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-black">
        {videoPreview ? (
          <video
            src={videoPreview}
            controls
            className="w-full"
            style={{ maxHeight: '60vh' }}
          />
        ) : rawVideoURL ? (
          <>
            <video
              src={rawVideoURL}
              className="w-full opacity-90"
              muted
              playsInline
              loop
              autoPlay
              style={{ maxHeight: '60vh' }}
            />

            {/* Logo Overlay Preview */}
            {logoPreviewURL && (
              <img
                src={logoPreviewURL}
                className={`absolute ${logoPositionClass} z-10 pointer-events-none`}
                style={{
                  width: logoSizeStyle,
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
                alt="Logo Preview"
              />
            )}

            {/* Name Card Preview */}
            <div
              className="absolute bottom-4 left-4 z-10 text-white p-4 rounded-lg shadow-xl backdrop-blur-sm"
              style={{
                backgroundColor: brandColor,
                maxWidth: '60%',
                minWidth: '300px',
              }}
            >
              <h3 className="text-lg font-bold leading-tight mb-1">{customerName}</h3>
              <p className="text-sm opacity-90">{customerRole}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-[400px] flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="text-6xl">🎬</div>
            <p className="text-lg">Upload a video to see preview</p>
          </div>
        )}
      </div>
    </div>
  );
}