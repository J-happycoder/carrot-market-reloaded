import { cookies } from "next/headers";
import { decrypt, encrypt } from "./aes-cbc";

const sessionName = "carrot-session";

function destroy() {
  cookies().delete(sessionName);
}

function set(data: any) {
  cookies().set(sessionName, encrypt(JSON.stringify(data)));
}

function get() {
  const sessionValue = cookies().get(sessionName)?.value;
  if (sessionValue) {
    return JSON.parse(decrypt(sessionValue));
  }
}

const session = {
  destroy,
  set,
  get,
};

export default session;
