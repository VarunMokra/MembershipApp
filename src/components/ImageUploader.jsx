import { useEffect, useRef, useState } from "react";

export default function ImageUploader({ onFileSelected, selectedImage }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    // Clean up object URL when component unmounts or image changes
    return () => {
      if (selectedImage && selectedImage.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    onFileSelected({ file, previewUrl: tempUrl });
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white/95 shadow rounded-xl p-3 w-full max-w-[320px]">
        <label className="block text-xs font-semibold text-gray-800 mb-2 text-center">
          Upload Photo
        </label>
        <div className="w-30 h-30 mx-auto mb-2 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 border-2 border-dashed border-blue-300 relative transition hover:border-blue-500">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="#e0f2fe"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v8m4-4H8"
                  stroke="#60a5fa"
                  strokeWidth="2"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-lg cursor-pointer shadow transition">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleChange}
              className="hidden"
              ref={inputRef}
            />
          </label>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Take a selfie or select from gallery.
        </p>
      </div>
    </div>
  );
}
