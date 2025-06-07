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

  const handleAreaClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br h-full from-blue-50 to-gray-100 rounded-xl">
      <div className="bg-white/95 flex items-center justify-center shadow rounded-xl p-3 w-full h-full max-w-[320px]">
        <div
          className="w-50 h-50 mx-auto mb-2 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300 relative hover:border-blue-500"
          onClick={handleAreaClick}
          title="Click to Upload Photo"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-w-[240px] aspect-square bg-gray-50 rounded-md cursor-pointer transition hover:border-blue-500">
              <img
                src="/camera.png"
                alt="Upload Photo here"
                className="w-[50%] h-[50%] mb-3"
              />
              <span className="text-sm font-semibold text-gray-600">
                Take a Photo
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleChange}
            className="hidden"
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}
