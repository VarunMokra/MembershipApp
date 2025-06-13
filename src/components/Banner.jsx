import { useEffect, useState } from "react";

const FALLBACK_BANNER =
  "https://placehold.co/600x400/FFFFFF/000000/png?text=Banner";

export default function Banner({ imageUrl }) {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    setImgSrc(imageUrl || FALLBACK_BANNER);
  }, [imageUrl]);

  const handleError = () => {
    setImgSrc(FALLBACK_BANNER);
  };

  return (
    <div className="w-full mt-4 rounded-xl overflow-hidden shadow-md">
      <img
        src={imgSrc}
        alt="Department Banner"
        className="w-full object-contain"
        onError={handleError}
      />
    </div>
  );
}
