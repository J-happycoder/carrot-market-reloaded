const { AES_KEY, AES_IV } = process.env;

async function getKey() {
  const keyData = new TextEncoder().encode(AES_KEY);

  return await crypto.subtle.importKey("raw", keyData, "AES-CBC", false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encrypt(plainText: string) {
  const encoder = new TextEncoder();

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: encoder.encode(AES_IV),
    },
    await getKey(),
    encoder.encode(plainText)
  );

  return Buffer.from(encrypted).toString("hex");
}

export async function decrypt(cipherText: string) {
  const encoder = new TextEncoder();

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: encoder.encode(AES_IV),
    },
    await getKey(),
    Buffer.from(cipherText, "hex")
  );

  return Buffer.from(decrypted).toString();
}
