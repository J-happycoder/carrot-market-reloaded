import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) redirect("/profile");
  return children;
}
