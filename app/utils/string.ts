export function firstLetterToUpper(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, start = 6, end = -4): string {
  return `${str.slice(0, start)}...${str.slice(end)}`
}
