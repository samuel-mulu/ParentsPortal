"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onScan: (studentId: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    checkCameraAvailability();
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (stream) {
        setHasCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setHasCamera(false);
      setError("Camera access denied. Please enter student ID manually.");
    }
  };

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    setError("");

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // QR code scanning implementation
    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Here you would integrate a QR code scanning library
      // For now, we'll simulate QR code detection with a mock implementation
      // In production, you'd use libraries like qr-scanner or jsqr

      try {
        // Mock QR code detection (replace with real QR scanning library)
        const mockStudentId = generateMockStudentId();

        if (mockStudentId) {
          onScan(mockStudentId);
          setIsScanning(false);
        }
      } catch (error) {
        console.error("QR scan error:", error);
        setError("Failed to scan QR code");
        setIsScanning(false);
      }
    };

    // Continuous scanning
    const scanInterval = setInterval(scanQRCode, 1000);

    // Cleanup after 10 seconds
    setTimeout(() => {
      clearInterval(scanInterval);
      setIsScanning(false);
    }, 10000);
  };

  const generateMockStudentId = () => {
    // Generate a realistic-looking student ID for demo
    return (
      Math.random().toString(36).substring(2, 14) +
      Math.random().toString(36).substring(2, 14) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const stopScanning = () => {
    setIsScanning(false);

    // Stop video stream if it exists
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => track.stop());
    }

    // Clear canvas
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
      }
    }
  };

  const handleManualInput = (studentId: string) => {
    onScan(studentId);
    stopScanning();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Scan Student ID</h3>
          <p className="text-sm text-gray-600 mb-4">
            Position the QR code in front of your camera or enter student ID
            manually
          </p>
        </div>

        {!hasCamera ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a9 9 0 011 9 9 0m3-9 9 0 01-2 2 0zm2 2a2 2 0 01-2 0zm2 2a2 2 0 01-2 0zm0 6a2 2 0 01-2 0zm2 2a2 2 0 01-2 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600">Camera not available</p>
            <p className="text-sm text-gray-500">
              Please enter student ID manually
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Hidden video element for camera access */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="hidden"
            />

            {/* Hidden canvas for QR code processing */}
            <canvas ref={canvasRef} className="hidden" />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isScanning && (
              <div className="text-center py-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018 8v4a2 2 0 01-2-2-2 0zm2 2a2 2 0 01-2 0zm2 2a2 2 0 01-2 0zm0 6a2 2 0 01-2 0zm2 2a2 2 0 01-2 0z"
                    />
                  </svg>
                  <span className="ml-2">Scanning QR code...</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {!isScanning && (
                <Button
                  onClick={startScanning}
                  className="flex-1 bg-blue-600 text-white"
                >
                  Start Scanning
                </Button>
              )}

              {isScanning && (
                <Button
                  onClick={stopScanning}
                  variant="outline"
                  className="flex-1"
                >
                  Stop Scanning
                </Button>
              )}

              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter Student ID manually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const input = e.target as HTMLInputElement;
                      handleManualInput(input.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
