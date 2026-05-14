import { useEffect } from "react"

interface Animatronik {
  id: string
  svg: string
  css: string
}

export function useStyle(
  animatroniks: Array<Pick<Animatronik, "css" | "svg">>,
) {
  useEffect(() => {
    if (typeof window === "undefined" || animatroniks.length === 0) {
      return
    }

    const STYLE_ID = "animatronik-style"
    const prevStyles = document.getElementById(STYLE_ID)

    if (prevStyles) {
      prevStyles.remove()
    }

    const style = document.createElement("style")
    const css = animatroniks.map(({ css }) => css).join("\n\n")
    style.textContent = css
    style.id = STYLE_ID
    document.head.appendChild(style)
  }, [animatroniks])
}
