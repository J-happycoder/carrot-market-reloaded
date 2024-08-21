import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
}
