import { pullInitials } from "../util/helpers";
import classNames from "classnames";
import { HTMLAttributes } from "react";
export const Image: React.FC<{
  src: string;
  alt: string;
  height: number | string;
  width: number | string;
  className?: HTMLAttributes<HTMLImageElement>["className"];
}> = ({ src, alt, height, width, className }) => {
  return src ? (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={classNames("object-cover h-full max-w-full w-full aspect-square", className)}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    />
  ) : (
    <div
      className={classNames("filler-img aspect-square object-cover", className)}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    >
      {pullInitials(alt)}
    </div>
  );
};
