import clsx from "clsx";
import type { ReactElement, ReactNode } from "react";

type Props =
  | {
      children?: ReactNode;
      className?: string;
    }
  | JSX.IntrinsicElements["button"];

export default function PrimaryButton({
  children,
  className: classNameProp,
}: Props): ReactElement {
  return (
    <button className={composeClassName(classNameProp)}>{children}</button>
  );
}

function composeClassName(className?: string) {
  return clsx(
    "move-up rounded-4xl border-2 border-gray-700 px-6 py-3 font-semibold uppercase md:px-8 md:py-4",
    className
  );
}
