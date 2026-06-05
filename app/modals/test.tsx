"use client";

import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { loadFaceModels } from "../faceapi/faceapi";

export default function VisitorLoginModal({
  isOpen,
  onClose,
  onSubmit,
}: any) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [idType, setIdType] = useState("");
  const [otherId, setOtherId] = useState("");

  const [step, setStep] = useState<"scan" | "form">("scan");
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const [mode, setMode] = useState<"NEW" | "EXISTING">("NEW");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const descriptorRef = useRef<number[] | null>(null);
  const imageRef = useRef<string>("");

  const gate =
    typeof window !== "undefined"
      ? localStorage.getItem("gate") || "Main Gate"
      : "Main Gate";

  useEffect(() => {
    loadFaceModels();
  }, []);

  if (!isOpen) return null;

  // ---------------- CAMERA ----------------
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

  // ---------------- FACE CAPTURE ----------------
  const getDescriptor = async () => {
    if (!videoRef.current) return null;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;

    return Array.from(detection.descriptor);
  };

  // ---------------- SCAN ----------------
  const captureAndCheck = async () => {
    if (loading) return;
    setLoading(true);

    const descriptor = await getDescriptor();

    if (!descriptor) {
      alert("No face detected");
      setLoading(false);
      return;
    }

    descriptorRef.current = descriptor;

    // take snapshot BEFORE stopping camera
    const canvas = document.createElement("canvas");
    const video = videoRef.current!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve) =>
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
    imageRef.current = uploadData.fileName;

    // CHECK FACE
    const res = await fetch("http://localhost:5432/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descriptor }),
    });

    const data = await res.json();

    setLoading(false);
    stopCamera();

    // ---------------- EXISTING VISITOR ----------------
    if (data.match) {
      setMode("EXISTING");

      setName(data.visitor.name || "Visitor");

      setStep("form");
      return;
    }

    // ---------------- NEW VISITOR ----------------
    setMode("NEW");
    setName("");
    setStep("form");
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    const finalId = idType === "Other ID" ? otherId : idType;

    await onSubmit(
      name,
      purpose,
      gate,
      finalId,
      imageRef.current,
      JSON.stringify(descriptorRef.current),
      mode
    );

    setLoading(false);
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl bg-white p-5 rounded-xl">

        <h2 className="text-center text-xl font-bold text-blue-700">
          Visitor System
        </h2>
        <h1>
          {step === "scan" ? "Scan Your Face" : mode === "EXISTING" ? "Welcome Back!" : "New Visitor"}
        </h1>
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
                disabled={loading}
                className="w-full mt-3 bg-green-600 text-white p-2"
              >
                {loading ? "Scanning..." : "Scan Face"}
              </button>
            )}
          </>
        )}

        {/* FORM */}
        {step === "form" && (
          <div className="space-y-2 mt-3">

            <input
              className="w-full border p-2"
              value={name}
              disabled={mode === "EXISTING"}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />

            <input
              className="w-full border p-2"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Purpose"
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
                value={otherId}
                onChange={(e) => setOtherId(e.target.value)}
                placeholder="Specify ID"
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 text-white p-2"
            >
              {mode === "EXISTING" ? "Log Visitor" : "Register Visitor"}
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