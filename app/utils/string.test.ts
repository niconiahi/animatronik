import { describe, expect, it } from "vitest"

import { firstLetterToUpper, truncate } from "./string"

describe("helpers/string", () => {
  it("should upper first letter", () => {
    const word = "hello world"
    const upperWord = "Hello world"

    expect(firstLetterToUpper(word)).toMatch(upperWord)
  })

  it("should truncate word", () => {
    const word = "hello world, this is Nicolas"
    const truncatedWord = "hello ...olas"

    expect(truncate(word)).toMatch(truncatedWord)
  })
})
