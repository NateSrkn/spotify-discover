import Image from "next/image";
import { pullInitials } from "../util/helpers";
export default function ImageComponent({ src, alt, height, width }) {
  return src ? (
    <Image
      src={src}
      height={height}
      width={width}
      alt={alt}
      objectFit="cover"
    />
  ) : (
    <div className="filler-img">{pullInitials(alt)}</div>
  );
}
