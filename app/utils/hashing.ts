import { json } from "@remix-run/cloudflare"

function getRandomString() {
  return (Math.random() + 1).toString(36).substring(7)
}

export function hashKeyframe(css: string) {
  const KEYFRAME_REGEX = /(?<=\@keyframes)(.*?)(?=\{)/
  const keyframeMatch = css.match(KEYFRAME_REGEX)
  const keyframe = keyframeMatch?.[0].trim()
  const keyframeHash = keyframe ? `${keyframe}-${getRandomString()}` : null
  const EVERY_KEYFRAME_REGEX = new RegExp(`${keyframe}`, "gm")

  return keyframe && keyframeHash
    ? css.replace(EVERY_KEYFRAME_REGEX, keyframeHash)
    : css
}

export function hashClassname(css: string) {
  const CLASS_NAME_REGEX = /(?<=\.)(.*?)(?=\s)/
  const classNameMatch = css.match(CLASS_NAME_REGEX)

  if (classNameMatch) {
    const classNameHash = `${classNameMatch[0].trim()}-${getRandomString()}`

    return css.replace(CLASS_NAME_REGEX, `${classNameHash} `)
  }
  else {
    throw json({ error: "No class name found", status: 404 })
  }
}
