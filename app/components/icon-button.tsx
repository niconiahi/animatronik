import clsx from "clsx"
import type { ReactElement, ReactNode } from "react"

type Props =
  | {
    children?: ReactNode
    className?: string
  }
  | JSX.IntrinsicElements["button"]

function IconButton({
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

export default IconButton

function composeClassName(className?: string) {
  return clsx(
    "p-2 hover:bg-gray-200 rounded transition duration-200 ease-in-out focus:outline-none focus:ring-2 text-black dark:text-white",
    className,
  )
}
