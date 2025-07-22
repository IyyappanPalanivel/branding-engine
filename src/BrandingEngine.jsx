import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

const BrandingEngine = () => {
  const [video, setVideo] = useState(null);
  const [logo, setLogo] = useState(null);
  const [brandColor, setBrandColor] = useState('#1DA1F2'); // Twitter-like blue
  const [position, setPosition] = useState('top-right');
  const [customerName, setCustomerName] = useState('');
  const [customerRole, setCustomerRole] = useState('');

  const handleVideoUpload = (e) => setVideo(e.target.files[0]);
  const handleLogoUpload = (e) => setLogo(e.target.files[0]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          🎬 Testimonial Branding Engine
        </h1>
        <p className="text-center text-gray-500">
          Turn raw videos into polished, on-brand testimonial assets in seconds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Raw Testimonial Video</label>
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="mt-2 w-full" />
          </div>

          {/* Upload Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Brand Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-2 w-full" />
          </div>

          {/* Customer Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-2 w-full border rounded-md p-2"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Role / Company</label>
            <input
              type="text"
              value={customerRole}
              onChange={(e) => setCustomerRole(e.target.value)}
              className="mt-2 w-full border rounded-md p-2"
              placeholder="e.g. CEO, Acme Inc"
            />
          </div>

          {/* Brand Theme Color */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Theme Color</label>
            <ChromePicker color={brandColor} onChange={(color) => setBrandColor(color.hex)} />
          </div>

          {/* Overlay Position */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Logo Overlay Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mt-2 w-full border rounded-md p-2"
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
            onClick={() => alert('🚀 Branding coming soon!')}
          >
            Brand It Now
          </button>
        </div>

        {/* Preview Placeholder */}
        <div className="text-center mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">🔍 Preview (Coming Soon)</h2>
          <div className="w-full aspect-video bg-gray-100 border border-dashed rounded-lg flex items-center justify-center text-gray-400">
            Video Preview Area
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingEngine;
