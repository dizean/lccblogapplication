"use client";

import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { loadFaceModels } from "../faceapi/faceapi";

interface VisitorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    purpose: string,
    gate: string,
    id: string,
    img: string,
    descriptor: string,
    mode: "EXISTING" | "NEW"
  ) => void;
}

export default function VisitorLoginModal({
  isOpen,
  onClose,
  onSubmit,
}: VisitorLoginModalProps) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [idType, setIdType] = useState("");
  const [otherId, setOtherId] = useState("");

  const [step, setStep] = useState<"scan" | "form">("scan");
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [mode, setMode] = useState<"EXISTING" | "NEW">("EXISTING");

  const [faceStatus, setFaceStatus] = useState("Initializing camera...");
  const [faceOk, setFaceOk] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const gate =
    typeof window !== "undefined"
      ? localStorage.getItem("gate") || "Galo Gate"
      : "Galo Gate";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const faceOkRef = useRef(false);
  const capturingRef = useRef(false);
  const loadingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageName, setImageName] = useState("");
  const [descriptor, setDescriptor] = useState("");

  useEffect(() => {
    loadFaceModels();
  }, []);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopAll();
    }
  }, [isOpen]);

  if (!isOpen) return null;
const setupCanvas = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight,
  };

  canvas.width = displaySize.width;
  canvas.height = displaySize.height;

  faceapi.matchDimensions(canvas, displaySize);
};
const startCamera = async () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas) return;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });

  video.srcObject = stream;

  await new Promise((resolve) => {
    video.onloadedmetadata = async () => {
      await video.play();

      setCameraReady(true);

      // ⚠️ use local refs (NOT videoRef.current)
      setupCanvas(video, canvas);

      resolve(true);
    };
  });

  startDetection();
  startCountdown();
};

  const startDetection = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    intervalRef.current = setInterval(async () => {
      try {
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        // clear overlay
        ctx?.clearRect(0, 0, canvas.width, canvas.height);

        if (!detection) {
          setFaceStatus("No face detected");
          setFaceOk(false);
          faceOkRef.current = false;
          setCountdown(5);
          return;
        }

        // draw overlay (box + landmarks)
        const resized = faceapi.resizeResults(detection, {
          width: canvas.width,
          height: canvas.height,
        });

        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);

        // BOX LOGIC (UNCHANGED)
        const box = detection.detection.box;

        const videoArea = video.videoWidth * video.videoHeight;
        const faceArea = box.width * box.height;
        const ratio = faceArea / videoArea;

        if (ratio < 0.08) {
          setFaceStatus("Move closer");
          setFaceOk(false);
          faceOkRef.current = false;
          setCountdown(5);
        } else if (ratio > 0.35) {
          setFaceStatus("Move back");
          setFaceOk(false);
          faceOkRef.current = false;
          setCountdown(5);
        } else {
          setFaceStatus("Face detected");
          setFaceOk(true);
          faceOkRef.current = true;
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);
  };

  const startCountdown = () => {
    if (countdownRef.current) return;

    setCountdown(5);

    countdownRef.current = setInterval(() => {
      if (
        !faceOkRef.current ||
        loadingRef.current ||
        capturingRef.current
      ) {
        setCountdown(5);
        return;
      }

      setCountdown((prev) => {
        if (prev <= 1) {
          captureAndCheck();
          return 5;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const stopAll = () => {
    const stream =
      videoRef.current?.srcObject as MediaStream | null;

    stream?.getTracks().forEach((track) => track.stop());

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    faceOkRef.current = false;
    capturingRef.current = false;

    setCameraReady(false);
    setFaceOk(false);
    setCountdown(5);
  };

  const getDescriptor = async () => {
    if (!videoRef.current) return null;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;

    return Array.from(detection.descriptor);
  };

  const captureAndCheck = async () => {
    if (capturingRef.current) return;

    capturingRef.current = true;
    setLoading(true);

    try {
      const desc = await getDescriptor();

      if (!desc) {
        return;
      }

      setDescriptor(JSON.stringify(desc));

      const video = videoRef.current;

      if (!video) return;

      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      ctx?.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob(
          (b) => resolve(b!),
          "image/jpeg",
          0.95
        )
      );

      const file = new File(
        [blob],
        `visitor_${Date.now()}.jpg`,
        {
          type: "image/jpeg",
        }
      );

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(
        "http://localhost:5432/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      setImageName(uploadData.fileName);

      const res = await fetch(
        "http://localhost:5432/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descriptor: desc,
          }),
        }
      );

      const data = await res.json();

      setName(data.visitor?.name || "");

      setMode(
        data.visitor
          ? "EXISTING"
          : "NEW"
      );

      stopAll();
      setStep("form");
    } catch (err) {
      console.error(err);
    } finally {
      capturingRef.current = false;
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const finalId = idType === "Other ID" ? otherId : idType;

    await onSubmit(
      name,
      purpose,
      gate,
      finalId,
      imageName,
      descriptor,
      mode
    );

    stopAll();
    onClose();
  };

  const handleClose = () => {
    stopAll();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl bg-white p-5 rounded-xl">
        <h1 className="text-3xl font-bold text-center">
          {step === "scan" ? "Scan Your Face" : mode === "EXISTING" ? `Welcome Back, ${name}!` : "New Visitor"}
        </h1>
        {step === "scan" && (
          <>
            <div className="relative w-full mt-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded bg-black"
              />

              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>

            <p className="text-center text-xl mt-2 font-medium text-gray-700">
              {faceStatus}
            </p>
            <div className="text-2xl text-center text-red-500 font-bold">
              Face: {faceOk ? "YES" : "NO"} | Count: {countdown}
            </div>
          </>
        )}

        {step === "form" && (
          <div className="space-y-2 mt-3">
            <input
              className="w-full border p-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full border p-2"
              placeholder="Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            <select
              className="w-full border p-2"
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
            >
              <option value="">Select ID</option>
              <option>Driver’s License</option>
              <option>Voter’s ID</option>
              <option>National ID</option>
              <option>Student ID</option>
              <option>Other ID</option>
            </select>

            {idType === "Other ID" && (
              <input
                className="w-full border p-2"
                placeholder="Specify ID"
                value={otherId}
                onChange={(e) => setOtherId(e.target.value)}
              />
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white p-2"
            >
              Log Visitor
            </button>
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full mt-3 bg-gray-400 text-white p-2"
        >
          Close
        </button>

      </div>
    </div>
  );
}