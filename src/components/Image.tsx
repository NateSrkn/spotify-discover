import cx from "classnames";
import { HTMLAttributes } from "react";
import NextImage from "next/image";
import { MicVocal } from "lucide-react";

export const Image: React.FC<{
  src: string;
  alt: string;
  height: number | string;
  width: number | string;
  className?: HTMLAttributes<HTMLImageElement>["className"];
}> = ({ src, alt, height, width, className }) => {
  return src ? (
    <NextImage
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={cx(
        "object-cover h-full max-w-full w-full aspect-square",
        className,
      )}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    />
  ) : (
    <div
      className={cx(
        "filler-img aspect-square object-cover flex items-center justify-center w-full bg-pewter-blue",
        className,
      )}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <MicVocal />
    </div>
  );
};
