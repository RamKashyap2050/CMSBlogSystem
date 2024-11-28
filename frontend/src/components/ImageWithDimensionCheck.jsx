import React, { useState } from "react";

const ImageWithDimensionCheck = ({ src, alt }) => {
  const [isPortrait, setIsPortrait] = useState(false);

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    setIsPortrait(naturalHeight > naturalWidth); // Check if height is greater than width
  };

  return (
    <div className="relative w-full rounded-lg shadow-md overflow-hidden">
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad} // Check dimensions when the image loads
        className={`inset-0 w-full h-full ${
          isPortrait ? "object-contain" : "object-cover"
        }`}
      />
    </div>
  );
};

export default ImageWithDimensionCheck;
