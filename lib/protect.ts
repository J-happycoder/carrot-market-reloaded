import { redirect } from "next/navigation";
import db from "./db";
import session from "./session";

async function getUser() {
  if (session.get()?.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.get()?.id,
      },
    });
    return user;
  }
}

export async function protect(routeType: "PUBLIC_ONLY" | "AUTHENTICATED_ONLY") {
  "use server";
  const user = await getUser();
  if (user && routeType === "PUBLIC_ONLY") return redirect("/products");
  if (!user && routeType === "AUTHENTICATED_ONLY") return redirect("/");
  return user;
}
