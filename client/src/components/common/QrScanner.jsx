import { useEffect, useRef, useState } from "react";
import { FiCameraOff } from "react-icons/fi";

export const QrScanner = ({ onDetect }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const detectorRef = useRef(null);
  const [status, setStatus] = useState("Requesting camera access...");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    let mounted = true;

    const stopScanner = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };

    const scanFrame = async () => {
      if (!mounted || !videoRef.current || !canvasRef.current || !detectorRef.current) {
        return;
      }

      const video = videoRef.current;
      if (video.readyState < 2) {
        frameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const codes = await detectorRef.current.detect(canvas);
        if (codes?.length) {
          const value = codes[0].rawValue;
          onDetect?.(value);
          setStatus("QR detected successfully.");
        }
      } catch {
        setStatus("Scanning in progress...");
      }

      frameRef.current = requestAnimationFrame(scanFrame);
    };

    const startScanner = async () => {
      if (!("BarcodeDetector" in window)) {
        setSupported(false);
        setStatus("Barcode Detector is not supported in this browser.");
        return;
      }

      try {
        detectorRef.current = new window.BarcodeDetector({ formats: ["qr_code"] });
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatus("Point the camera at a QR code.");
        frameRef.current = requestAnimationFrame(scanFrame);
      } catch {
        setStatus("Unable to access the camera. Check browser permissions.");
      }
    };

    startScanner();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [onDetect]);

  if (!supported) {
    return (
      <div className="flex h-72 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-100/60 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <FiCameraOff className="text-3xl text-command" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{status}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Use a Chromium-based browser for live QR scanning.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[28px] bg-slate-950">
        <video ref={videoRef} playsInline muted className="h-72 w-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-300">{status}</p>
    </div>
  );
};
