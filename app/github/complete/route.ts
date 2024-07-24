import db from "@/lib/db";
import session from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

async function getAccessToken(code: string) {
  const { access_token } = await (
    await fetch(
      `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    )
  ).json();
  return access_token;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return new NextResponse(null, { status: 400 });

  const access_token = await getAccessToken(code);
  if (!access_token) return new NextResponse(null, { status: 500 });

  const octokit = new Octokit({ auth: access_token });

  const { data } = await octokit.request("GET /user");
  if (!data) return new NextResponse(null, { status: 500 });

  const { id: githubId, login: username, avatar_url: avatarUrl } = data;

  const user = await db.user.upsert({
    where: {
      githubId,
    },
    create: {
      authType: "GITHUB",
      githubId,
      username,
      avatarUrl,
    },
    update: {},
    select: { id: true },
  });

  session.set(user);

  return redirect("/profile");
}
