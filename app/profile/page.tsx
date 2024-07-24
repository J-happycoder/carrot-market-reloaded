import { protect } from "@/lib/protect";
import session from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await protect("AUTHENTICATED_ONLY");
  const logout = async () => {
    "use server";
    session.destroy();
    redirect("/");
  };
  return (
    <div>
      <span className="mr-3">Welcome</span>
      {user?.authType === "GITHUB" && <span>gh-{user.username}</span>}
      {user?.authType === "PASSWORD" && <span>{user.username}</span>}
      <form action={logout}>
        <button>log out</button>
      </form>
    </div>
  );
}
