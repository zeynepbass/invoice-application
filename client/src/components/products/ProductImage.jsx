import { PictureOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage = ({ src, alt = "", className = "" }) => {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <span
        className={`flex items-center justify-center bg-slate-100 text-2xl text-slate-400 ${className}`}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        <PictureOutlined />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`bg-slate-100 object-cover ${className}`}
      onError={() => setFailedSrc(src)}
    />
  );
};

export default ProductImage;
