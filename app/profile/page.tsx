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
      {user?.githubId ? (
        <span>gh-{user.githubUsername}</span>
      ) : (
        <span>{user?.username}</span>
      )}
      <form action={logout}>
        <button>log out</button>
      </form>
    </div>
  );
}
