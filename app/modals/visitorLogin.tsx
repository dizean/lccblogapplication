"use client";

import { useRef, useState } from "react";

interface VisitorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    purpose: string,
    gate: string,
    id: string,
    img: string
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
  const gate = localStorage.getItem("gate") || "Main Gate";
  // IMAGE
  const [img, setImg] = useState("");
  const [preview, setPreview] = useState("");

  // CAMERA
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  // START CAMERA
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOpen(true);
    } catch (error) {
      console.error(error);
      alert("Unable to access camera");
    }
  };

  // STOP CAMERA
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;

      stream.getTracks().forEach((track) => track.stop());

      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  // CAPTURE IMAGE
const captureImage = async () => {
  if (!videoRef.current || !canvasRef.current) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(video, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) return;

    const cleanName = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    const fileName = `${cleanName}_${Date.now()}.jpg`;

    const file = new File([blob], fileName, {
      type: "image/jpeg",
    });

    // preview only
    setPreview(URL.createObjectURL(file));

    // store file ONLY (NO UPLOAD YET)
    setCapturedFile(file);

    // store filename for DB
    setImg(fileName);

    stopCamera();
  }, "image/jpeg", 0.95);
};

  // SUBMIT
const handleSubmit = async () => {
  if (!name.trim() || !purpose.trim() || !idType.trim()) {
    alert("Please fill out all fields.");
    return;
  }

  if (idType === "Other ID" && !otherId.trim()) {
    alert("Please specify the ID type.");
    return;
  }

  if (!capturedFile) {
    alert("Please capture an image.");
    return;
  }

  const finalId = idType === "Other ID" ? otherId : idType;

  try {
    const formData = new FormData();
    formData.append("file", capturedFile);

    const res = await fetch("http://localhost:5432/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Upload failed");
      return;
    }

    console.log("Uploaded:", data);

    // send ONLY filename to DB
    onSubmit(name, purpose, gate, finalId, data.fileName);

    // reset
    setName("");
    setPurpose("");
    setIdType("");
    setOtherId("");
    setImg("");
    setPreview("");
    setCapturedFile(null);

    onClose();
  } catch (error) {
    console.error(error);
    alert("Upload error");
  }
};

  // CLOSE MODAL
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sm:p-8 max-h-[95vh] overflow-y-auto">

        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0441B1] mb-6 text-center">
          Visitor Check-In
        </h2>

        {/* FORM */}
        <div className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          />

          {/* PURPOSE */}
          <input
            type="text"
            placeholder="Purpose of Visit"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
          />

          {/* ID TYPE */}
          <select
            value={idType}
            onChange={(e) => {
              setIdType(e.target.value);

              if (e.target.value !== "Other ID") {
                setOtherId("");
              }
            }}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0441B1] outline-none"
          >
            <option value="">Select ID Type</option>
            <option value="Driver’s License">Driver’s License</option>
            <option value="Voter’s ID">Voter’s ID</option>
            <option value="National ID">National ID</option>
            <option value="Student ID">Student ID</option>
            <option value="Other ID">Other ID</option>
          </select>

          {/* OTHER ID */}
          {idType === "Other ID" && (
            <input
              type="text"
              placeholder="Specify ID Type"
              value={otherId}
              onChange={(e) => setOtherId(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0441B1] outline-none"
            />
          )}

          {/* CAMERA */}
          <div className="space-y-3">

            {!cameraOpen && (
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Open Camera
              </button>
            )}

            {/* VIDEO */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full rounded-xl border bg-black ${
                cameraOpen ? "block" : "hidden"
              }`}
            />

            {/* HIDDEN CANVAS */}
            <canvas ref={canvasRef} className="hidden" />

            {/* CAMERA ACTIONS */}
            {cameraOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={captureImage}
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Capture Image
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                >
                  Close Camera
                </button>

              </div>
            )}

            {/* PREVIEW */}
            {preview && (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Captured"
                  className="w-full rounded-xl border object-cover max-h-80"
                />

                <p className="text-sm text-gray-600 break-all text-center">
                  {img}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <button
            onClick={handleSubmit}
            className="w-full sm:w-1/2 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            Submit
          </button>

          <button
            onClick={handleClose}
            className="w-full sm:w-1/2 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}