import { createCipheriv, createDecipheriv } from "crypto";

const { AES_KEY, AES_IV } = process.env;

export function encrypt(plainText: string) {
  const cipher = createCipheriv("aes-256-cbc", AES_KEY!, AES_IV!);
  const cipherText = Buffer.concat([
    cipher.update(plainText),
    cipher.final(),
  ]).toString("hex");
  return cipherText;
}

export function decrypt(cipherText: string) {
  let decipher = createDecipheriv("aes-256-cbc", AES_KEY!, AES_IV!);
  const plainText = Buffer.concat([
    decipher.update(Buffer.from(cipherText, "hex")),
    decipher.final(),
  ]).toString();
  return plainText;
}
