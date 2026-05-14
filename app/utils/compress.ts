export async function compress(data: string): Promise<string> {
  const stream = new CompressionStream("deflate-raw")
  const writer = stream.writable.getWriter()
  writer.write(new TextEncoder().encode(data))
  writer.close()
  const buffer = await new Response(stream.readable).arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

export async function decompress(data: string): Promise<string> {
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const stream = new DecompressionStream("deflate-raw")
  const writer = stream.writable.getWriter()
  writer.write(bytes)
  writer.close()
  const buffer = await new Response(stream.readable).arrayBuffer()
  return new TextDecoder().decode(buffer)
}
