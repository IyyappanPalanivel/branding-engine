// BrandingEngineUI.jsx
import React, { useState } from 'react';
import { brandTestimonialVideo } from './core/brandingEngine';

export default function BrandingEngineUI() {
  const [videoFile, setVideoFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [customerName, setCustomerName] = useState('Jane Doe');
  const [customerRole, setCustomerRole] = useState('Marketing Manager');
  const [brandColor, setBrandColor] = useState('#FF5733');
  const [logoPosition, setLogoPosition] = useState('top-right');
  const [logoSize, setLogoSize] = useState('medium');
  const [videoPreview, setVideoPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const handleRender = async () => {
    if (!videoFile || !logoFile) return alert('Upload video and logo first');
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
    <div className="flex w-full min-h-screen bg-gray-100 text-gray-800">
      {/* Left Configuration Panel */}
      <div className="w-1/3 p-6 space-y-6 bg-white shadow-xl">
        <h2 className="text-xl font-bold">Branding Config</h2>

        <div>
          <label className="block font-medium">Raw Testimonial Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block font-medium">Brand Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block font-medium">Customer Name</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input" />
        </div>

        <div>
          <label className="block font-medium">Customer Role</label>
          <input type="text" value={customerRole} onChange={(e) => setCustomerRole(e.target.value)} className="input" />
        </div>

        <div>
          <label className="block font-medium">Brand Color</label>
          <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-16 h-10 p-0" />
        </div>

        <div>
          <label className="block font-medium">Logo Position</label>
          <select value={logoPosition} onChange={(e) => setLogoPosition(e.target.value)} className="input">
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Logo Size</label>
          <select value={logoSize} onChange={(e) => setLogoSize(e.target.value)} className="input">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <button onClick={handleRender} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full">
          Start Branding
        </button>

        <div className="mt-4">
          <p className="font-medium">Progress: {progress}%</p>
          <progress className="w-full" value={progress} max="100"></progress>
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
        {videoPreview ? (
          <video src={videoPreview} controls className="w-full max-w-3xl rounded-xl shadow-xl"></video>
        ) : (
          <div className="w-full h-[400px] flex items-center justify-center border rounded-xl text-gray-500 bg-white shadow-inner">
            No Preview Yet
          </div>
        )}

        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Engine Logs</h3>
          <pre className="text-xs h-40 overflow-auto bg-gray-100 p-2 rounded">
            {logs.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
}