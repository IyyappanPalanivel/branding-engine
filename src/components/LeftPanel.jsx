import React, { useState } from 'react'
import VideoRecorder from './VideoRecorder'

function LeftPanel({ videoFile, logoFile, setVideoFile, setLogoFile, customerName, setCustomerName, customerRole, setCustomerRole, brandColor, setBrandColor, logoPosition, setLogoPosition, logoSize, setLogoSize, isProcessing, handleRender, progress }) {
  const [videoMode, setVideoMode] = useState('upload'); // 'upload' or 'record'

  return (
    <div className="w-1/3 min-w-[380px] p-6 space-y-6 bg-white border-r shadow-lg overflow-y-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">🎨 Video Branding Studio</h1>
        <p className="text-gray-600 text-sm">Transform raw videos into branded testimonials</p>
      </div>

      {/* Video Input Mode Tabs */}
      <div className="space-y-4">
        {/* Tab Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
          <button
            onClick={() => setVideoMode('upload')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${videoMode === 'upload'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <span>📤</span>
            <span>Upload</span>
          </button>
          <button
            onClick={() => setVideoMode('record')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${videoMode === 'record'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <span>🎥</span>
            <span>Record</span>
          </button>
        </div>

        {/* Upload Mode */}
        {videoMode === 'upload' && (
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
        )}

        {/* Record Mode */}
        {videoMode === 'record' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🎥 Record Testimonial Video</label>
            <VideoRecorder onVideoRecorded={setVideoFile} />
          </div>
        )}

        {/* Logo Upload (always visible) */}
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
  );
}

export default LeftPanel