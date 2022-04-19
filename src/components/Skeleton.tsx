import { Fragment } from "react";

export const Skeleton = ({ count, component: Component }) => {
  const items = Array.from({ length: count }, (_, index) => index);
  return (
    <Fragment>
      {items.map((_, index) => (
        <Component key={index} />
      ))}
    </Fragment>
  );
};
