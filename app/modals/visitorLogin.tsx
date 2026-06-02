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
  const gate =
    typeof window !== "undefined"
      ? localStorage.getItem("gate") || "Galo Gate"
      : "Galo Gate";

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    loadFaceModels();
  }, []);

  if (!isOpen) return null;

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current!.onloadedmetadata = async () => {
          await videoRef.current!.play();
          setCameraReady(true);
          resolve(true);
        };
      });
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    setCameraReady(false);
  };
  const [imageName, setImageName] = useState("");
  const [descriptor, setDescriptor] = useState("");
  const getDescriptor = async () => {
    if (!videoRef.current) return null;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;

    return Array.from(detection.descriptor);
  };

  const captureAndCheck = async () => {
    setLoading(true);

    const descriptor = await getDescriptor();

    if (!descriptor) {
      alert("No face detected");
      setLoading(false);
      return;
    }
    setDescriptor(JSON.stringify(descriptor));
    try {
      // 1. Capture image from video
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      if (!video) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
      );

      const file = new File([blob], `visitor_${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("http://localhost:5432/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      setImageName(uploadData.fileName);
      if (!uploadRes.ok) {
        alert("Upload failed");
        setLoading(false);
        return;
      }
      const res = await fetch("http://localhost:5432/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descriptor,
        }),
      });

      const data = await res.json();
      setLoading(false);
      setName(data.visitor?.name || "");
      setMode(data.visitor ? "EXISTING" : "NEW");
      stopCamera();
      setStep("form");
    } catch (err) {
      console.error(err);
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

    stopCamera();
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl bg-white p-5 rounded-xl">
        {step === "scan" && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full mt-3 rounded bg-black"
            />

            {!cameraReady ? (
              <button
                onClick={startCamera}
                className="w-full mt-3 bg-blue-600 text-white p-2"
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={captureAndCheck}
                className="w-full mt-3 bg-green-600 text-white p-2"
              >
                {loading ? "Scanning..." : "Scan Face"}
              </button>
            )}
          </>
        )}
        {step === "form" && (
          <div className="space-y-2 mt-3">
            <input
              placeholder="Name"
              className="w-full border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Purpose"
              className="w-full border p-2"
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
              Register Visitor
            </button>
          </div>
        )}
        <button onClick={handleClose} className="w-full mt-3 bg-gray-400 text-white p-2">
          Close
        </button>

      </div>
    </div>
  );
}