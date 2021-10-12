import { pullInitials } from "../util/helpers";
export default function ImageComponent({ src, alt, height, width }) {
  return src ? (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className="object-cover"
    />
  ) : (
    <div className="filler-img">{pullInitials(alt)}</div>
  );
}
