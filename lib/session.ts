import { cookies } from "next/headers";
import { decrypt, encrypt } from "./aes-cbc";

const sessionName = "carrot-session";

export function destroySession() {
  cookies().delete(sessionName);
}

export async function setSession(data: any) {
  cookies().set(sessionName, await encrypt(JSON.stringify(data)));
}

export async function getSession() {
  const sessionValue = cookies().get(sessionName)?.value;
  if (sessionValue) {
    return JSON.parse(await decrypt(sessionValue));
  }
}
