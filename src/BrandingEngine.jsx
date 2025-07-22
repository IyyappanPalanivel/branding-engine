import React, { useState, useEffect } from 'react';
import { brandTestimonialVideo } from './core/brandingEngine';

function getPosition(position) {
  const map = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  return map[position] || 'top-4 right-4';
}

function getLogoSize(size) {
  switch (size) {
    case 'small':
      return '50px';
    case 'large':
      return '120px';
    default:
      return '80px';
  }
}


export default function BrandingEngineUI() {
  const [videoFile, setVideoFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [customerName, setCustomerName] = useState('Jane Doe');
  const [customerRole, setCustomerRole] = useState('Marketing Manager');
  const [brandColor, setBrandColor] = useState('#FF5733');
  const [logoPosition, setLogoPosition] = useState('top-right');
  const [logoSize, setLogoSize] = useState('medium');
  const [videoPreview, setVideoPreview] = useState(null);
  const [rawVideoURL, setRawVideoURL] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setRawVideoURL(url);
    }
  }, [videoFile]);

  const handleRender = async () => {
    if (!videoFile || !logoFile) return alert('Upload both video and logo first');

    setVideoPreview(null);
    setProgress(0);
    setLogs([]);

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
  };

  return (
    <div className="flex flex-row w-full h-screen bg-[#f8f9fa] text-gray-800 font-sans overflow-hidden">
      {/* Left Configuration Panel */}
      <div className="w-1/3 min-w-[350px] p-6 space-y-6 bg-white border-r overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">🎨 Branding Config</h2>

        {/* Raw Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Raw Testimonial Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Brand Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Role</label>
          <input
            type="text"
            value={customerRole}
            onChange={(e) => setCustomerRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Marketing Manager"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
          <input
            type="color"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
            className="w-16 h-10 border-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo Position</label>
          <select
            value={logoPosition}
            onChange={(e) => setLogoPosition(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <button
          onClick={handleRender}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full mt-4"
        >
          🚀 Start Branding
        </button>

        <div className="mt-4">
          <label className="text-sm font-medium">Progress: {progress}%</label>
          <progress className="w-full" value={progress} max="100"></progress>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col flex-1 p-6">
        {/* Live Preview */}
        <div className="flex-1 mb-6">
          <h2 className="text-xl font-bold mb-2">🔍 Live Preview</h2>
          <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow border bg-black">
            {videoPreview ? (
              <video src={videoPreview} controls className="w-full" />
            ) : rawVideoURL ? (
              <>
                <video
                  src={rawVideoURL}
                  className="w-full opacity-90"
                  muted
                  playsInline
                  loop
                />
                {/* Logo Overlay */}
                {logoFile && (
                  <img
                    src={URL.createObjectURL(logoFile)}
                    className={`absolute ${getPosition(logoPosition)} z-10`}
                    style={{
                      width: getLogoSize(logoSize),
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                    alt="Logo Preview"
                  />
                )}
                {/* Name Card Overlay */}
                <div
                  className="absolute bottom-4 left-4 z-10 text-white p-3 rounded-lg shadow-lg"
                  style={{
                    backgroundColor: brandColor,
                    maxWidth: '60%',
                  }}
                >
                  <h3 className="text-md font-bold leading-tight">{customerName}</h3>
                  <p className="text-xs">{customerRole}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
                No video selected
              </div>
            )}
          </div>
        </div>

        {/* Logs */}
        <div className="h-48 bg-white p-4 rounded shadow overflow-auto">
          <h3 className="font-semibold text-sm mb-2 text-gray-700">📜 Engine Logs</h3>
          <pre className="text-xs whitespace-pre-wrap font-mono text-gray-600">{logs.join('\n')}</pre>
        </div>
      </div>
    </div>
  );
}