import clsx from "clsx"
import type { ReactElement, ReactNode } from "react"

type Props =
  | {
    children?: ReactNode
    className?: string
  }
  | JSX.IntrinsicElements["button"]

export default function PrimaryButton({
  children,
  className: classNameProp,
  ...buttonProps
}: Props): ReactElement {
  return (
    <button className={composeClassName(classNameProp)} {...buttonProps}>
      {children}
    </button>
  )
}

function composeClassName(className?: string) {
  return clsx(
    "bg-white move-up rounded-4xl border-2 border-gray-700 md:py-auto py-[8px] md:py-[12px] font-semibold uppercase md:px-8 md:py-4 disabled:bg-gray-200 px-4",
    className,
  )
}
