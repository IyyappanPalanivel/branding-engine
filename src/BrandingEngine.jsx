import React, { useState, useEffect, useMemo, useCallback } from 'react';
import brandTestimonialVideo from './core/brandingEngine';

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
      <div className="w-1/3 min-w-[380px] p-6 space-y-6 bg-white border-r shadow-lg overflow-y-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">🎨 Video Branding Studio</h1>
          <p className="text-gray-600 text-sm">Transform raw videos into branded testimonials</p>
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📹 Raw Testimonial Video</label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {videoFile && <p className="text-xs text-green-600 mt-1">✓ {videoFile.name}</p>}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Brand Logo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setLogoFile(e.target.files[0])}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {logoFile && <p className="text-xs text-green-600 mt-1">✓ {logoFile.name}</p>}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">👤 Customer Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role/Title</label>
            <input
              type="text"
              value={customerRole}
              onChange={(e) => setCustomerRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter role or title"
            />
          </div>
        </div>

        {/* Branding Options */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">🎨 Branding Options</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo Position</label>
              <select
                value={logoPosition}
                onChange={(e) => setLogoPosition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo Size</label>
              <select
                value={logoSize}
                onChange={(e) => setLogoSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRender}
          disabled={!videoFile || !logoFile || isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isProcessing ? '⏳ Processing...' : '🚀 Generate Branded Video'}
        </button>

        {/* Progress */}
        {isProcessing && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-blue-700">Progress</span>
              <span className="text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-1 p-6 space-y-6">
        {/* Preview Section */}
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

        {/* Logs Section */}
        <div className="h-48 bg-white rounded-lg shadow border overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-700">📜 Processing Logs</h3>
            <button
              onClick={clearLogs}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="p-4 h-full overflow-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono text-gray-600 leading-relaxed">
              {logs.length > 0 ? logs.join('\n') : 'Waiting for processing to start...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}