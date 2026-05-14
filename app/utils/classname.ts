export function getClassname(css: string) {
  const CLASS_NAME_REGEX = /(?:[.])([^ ]+)?/
  const classNameMatch = css.match(CLASS_NAME_REGEX)

  if (!classNameMatch) {
    throw new Error("An animatronik should contain a CSS class")
  }

  return classNameMatch[1].trim()
}
