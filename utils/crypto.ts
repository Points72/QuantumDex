type DigestType = "hex" | "base64"

interface HmacResult {
  update(data: string): {
    digest(encoding: DigestType): Promise<string>
  }
}

export async function createHmac(algorithm: string, key: string): Promise<HmacResult> {
  const enc = new TextEncoder()
  const keyData = enc.encode(key)

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "HMAC",
      hash: algorithm === "sha256" ? "SHA-256" : "SHA-512",
    },
    false,
    ["sign"],
  )

  return {
    update(data: string) {
      return {
        async digest(encoding: DigestType): Promise<string> {
          const dataBuffer = enc.encode(data)
          const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, dataBuffer)

          const signatureArray = Array.from(new Uint8Array(signatureBuffer))

          if (encoding === "hex") {
            return signatureArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
          }

          if (encoding === "base64") {
            return btoa(String.fromCharCode(...signatureArray))
          }

          throw new Error(`Unsupported encoding: ${encoding}`)
        },
      }
    },
  }
}

