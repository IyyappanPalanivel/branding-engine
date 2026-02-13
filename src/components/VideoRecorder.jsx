import React, { useState, useRef, useEffect } from 'react';
import {
    getMediaStream,
    getSupportedMimeType,
    blobToFile,
    formatRecordingTime,
    stopMediaStream
} from '../utils/mediaRecorder';

/**
 * VideoRecorder Component
 * Handles video recording with camera preview, controls, and timer
 */
function VideoRecorder({ onVideoRecorded }) {
    const [stream, setStream] = useState(null);
    const [recordingState, setRecordingState] = useState('idle'); // idle, recording, paused, stopped
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState(null);
    const [recordedVideoURL, setRecordedVideoURL] = useState(null);

    const videoPreviewRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerIntervalRef = useRef(null);

    // Initialize camera on mount
    useEffect(() => {
        initializeCamera();
        return () => {
            cleanup();
        };
    }, []);

    // Update video preview when stream changes
    useEffect(() => {
        if (videoPreviewRef.current && stream) {
            videoPreviewRef.current.srcObject = stream;
        }
    }, [stream]);

    /**
     * Initialize camera and request permissions
     */
    const initializeCamera = async () => {
        try {
            setError(null);
            const mediaStream = await getMediaStream();
            setStream(mediaStream);
        } catch (err) {
            setError(err.message);
        }
    };

    /**
     * Start recording
     */
    const startRecording = () => {
        if (!stream) {
            setError('Camera not initialized. Please allow camera access.');
            return;
        }

        try {
            const mimeType = getSupportedMimeType();
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond: 2500000 // 2.5 Mbps
            });

            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                const videoFile = blobToFile(blob);
                const url = URL.createObjectURL(blob);

                setRecordedVideoURL(url);
                onVideoRecorded(videoFile);
                setRecordingState('stopped');
            };

            mediaRecorder.start(100); // Collect data every 100ms
            mediaRecorderRef.current = mediaRecorder;
            setRecordingState('recording');
            setRecordingTime(0);
            startTimer();
        } catch (err) {
            setError(`Failed to start recording: ${err.message}`);
        }
    };

    /**
     * Pause recording
     */
    const pauseRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'recording') {
            mediaRecorderRef.current.pause();
            setRecordingState('paused');
            stopTimer();
        }
    };

    /**
     * Resume recording
     */
    const resumeRecording = () => {
        if (mediaRecorderRef.current && recordingState === 'paused') {
            mediaRecorderRef.current.resume();
            setRecordingState('recording');
            startTimer();
        }
    };

    /**
     * Stop recording
     */
    const stopRecording = () => {
        if (mediaRecorderRef.current && (recordingState === 'recording' || recordingState === 'paused')) {
            mediaRecorderRef.current.stop();
            stopTimer();
        }
    };

    /**
     * Start timer
     */
    const startTimer = () => {
        timerIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    /**
     * Stop timer
     */
    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    /**
     * Record new video (reset)
     */
    const recordNewVideo = () => {
        if (recordedVideoURL) {
            URL.revokeObjectURL(recordedVideoURL);
        }
        setRecordedVideoURL(null);
        setRecordingState('idle');
        setRecordingTime(0);
        chunksRef.current = [];
        onVideoRecorded(null);
    };

    /**
     * Cleanup resources
     */
    const cleanup = () => {
        stopTimer();
        stopMediaStream(stream);
        if (recordedVideoURL) {
            URL.revokeObjectURL(recordedVideoURL);
        }
    };

    /**
     * Retry camera initialization
     */
    const retryCamera = () => {
        setError(null);
        initializeCamera();
    };

    // Error state
    if (error && !stream) {
        return (
            <div className="border-2 border-dashed border-red-300 rounded-lg p-6 bg-red-50">
                <div className="text-center space-y-4">
                    <div className="text-4xl">🎥</div>
                    <div className="text-red-700 font-semibold">Camera Access Required</div>
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                        onClick={retryCamera}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    // Recorded video preview
    if (recordingState === 'stopped' && recordedVideoURL) {
        return (
            <div className="space-y-4">
                <div className="border-2 border-green-300 rounded-lg overflow-hidden bg-black">
                    <video
                        src={recordedVideoURL}
                        controls
                        className="w-full"
                        style={{ maxHeight: '300px' }}
                    />
                </div>
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                        <span className="text-green-600 text-2xl">✓</span>
                        <div>
                            <p className="text-sm font-semibold text-green-700">Recording Complete</p>
                            <p className="text-xs text-green-600">Duration: {formatRecordingTime(recordingTime)}</p>
                        </div>
                    </div>
                    <button
                        onClick={recordNewVideo}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        🎥 Record New
                    </button>
                </div>
            </div>
        );
    }

    // Recording interface
    return (
        <div className="space-y-4">
            {/* Camera Preview */}
            <div className="relative border-2 border-dashed border-blue-300 rounded-lg overflow-hidden bg-black">
                <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full"
                    style={{ maxHeight: '300px' }}
                />

                {/* Recording Indicator */}
                {recordingState === 'recording' && (
                    <div className="absolute top-3 left-3 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-sm font-semibold">REC</span>
                    </div>
                )}

                {/* Paused Indicator */}
                {recordingState === 'paused' && (
                    <div className="absolute top-3 left-3 flex items-center space-x-2 bg-yellow-600 text-white px-3 py-1 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-sm font-semibold">PAUSED</span>
                    </div>
                )}

                {/* Timer */}
                {(recordingState === 'recording' || recordingState === 'paused') && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
                        <span className="font-mono text-sm font-semibold">{formatRecordingTime(recordingTime)}</span>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="space-y-2">
                {recordingState === 'idle' && (
                    <button
                        onClick={startRecording}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                        <span className="text-xl">⏺</span>
                        <span>Start Recording</span>
                    </button>
                )}

                {recordingState === 'recording' && (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={pauseRecording}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            <span className="text-xl">⏸</span>
                            <span>Pause</span>
                        </button>
                        <button
                            onClick={stopRecording}
                            className="bg-gray-700 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            <span className="text-xl">⏹</span>
                            <span>Stop</span>
                        </button>
                    </div>
                )}

                {recordingState === 'paused' && (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={resumeRecording}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            <span className="text-xl">▶</span>
                            <span>Resume</span>
                        </button>
                        <button
                            onClick={stopRecording}
                            className="bg-gray-700 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            <span className="text-xl">⏹</span>
                            <span>Stop</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Error message during recording */}
            {error && stream && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
}

export default VideoRecorder;
