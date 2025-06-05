import { useEffect, useState } from "react";

const FALLBACK_BANNER =
  "https://placehold.co/600x400/FFFFFF/000000/png?text=Banner"; // Place a fallback image in your public folder

export default function Banner({ imageUrl }) {
  function convertDriveUrl(url) {
    const regex = /\/d\/([a-zA-Z0-9_-]+)\//;
    const match = url.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return null;
  }

  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const converted = convertDriveUrl(imageUrl);
    setImgSrc(converted || FALLBACK_BANNER);
  }, [imageUrl]);

  const handleError = () => {
    setImgSrc(FALLBACK_BANNER);
  };

  return (
    <div className="w-full mt-4 rounded-xl overflow-hidden shadow-md">
      <img
        src={imgSrc}
        alt="Department Banner"
        className="w-full h-80 object-cover"
        onError={handleError}
      />
    </div>
  );
}
