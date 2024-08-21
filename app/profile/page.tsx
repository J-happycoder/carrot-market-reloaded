import { destroySession } from "@/lib/session";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();
  const logout = async () => {
    "use server";
    destroySession();
    redirect("/");
  };
  return (
    <div className="max-w-xl w-full mx-auto flex flex-col">
      <span className="mr-3">Welcome</span>
      {user?.authType === "GITHUB" && (
        <span>gh-{user.username || "당근이"}</span>
      )}
      {user?.authType !== "GITHUB" && <span>{user?.username || "당근이"}</span>}
      <form action={logout}>
        <button>log out</button>
      </form>
    </div>
  );
}
