"use client";

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onCancel: () => void;
}

export default function PrivacyNoticeModal({
  isOpen,
  onAgree,
  onCancel,
}: PrivacyNoticeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-[#0441B1] text-center mb-4">
          Visitor Data Privacy Notice
        </h1>

        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
          This system captures facial images and biometric descriptors for
          security, identity verification, and visitor logging purposes.
        </p>

        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
          Data may be used for monitoring, auditing, and security
          investigations if required. All data is stored securely and is not
          shared with unauthorized parties.
        </p>

        <p className="text-sm md:text-base font-semibold text-red-600 mb-6">
          By continuing, you consent to the capture and processing of your
          facial data.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAgree}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            I Agree & Continue
          </button>

          <button
            onClick={onCancel}
            className="w-full bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}