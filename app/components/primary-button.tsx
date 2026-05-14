import type {
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react"

type Props =
  | {
      children?: ReactNode
      className?: string
    }
  | ButtonHTMLAttributes<HTMLButtonElement>

export default function PrimaryButton({
  children,
  className: classNameProp,
  ...buttonProps
}: Props): ReactElement {
  const base =
    "bg-white move-up rounded-4xl border-2 border-gray-700 md:py-auto py-[8px] md:py-[12px] font-semibold uppercase md:px-8 md:py-4 disabled:bg-gray-200 px-4"
  return (
    <button
      className={classNameProp ? `${base} ${classNameProp}` : base}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
