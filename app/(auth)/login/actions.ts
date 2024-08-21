"use server";

import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import { setSession } from "@/lib/session";
import { redirect } from "next/navigation";

async function checkPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: {
      email,
      hashedPassword: {
        not: null,
      },
    },
    select: {
      hashedPassword: true,
    },
  });
  if (!user) return false;

  const correct = await bcrypt.compare(password, user.hashedPassword!);

  if (correct) return true;
}

const loginDataSchema = z
  .object({
    email: z.string().email("올바른 형식으로 써주세요.").trim().toLowerCase(),
    password: z.string().trim(),
  })
  .refine(checkPassword, {
    message: "이메일 또는 비밀번호가 틀렸어요.",
    path: ["password"],
  });

async function validateLoginForm(formData: FormData) {
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validationResult = await loginDataSchema.safeParseAsync(loginData);
  return validationResult;
}

async function login({ email }: { email: string }) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  await setSession(user);
  redirect("/profile");
}

export async function handleLoginForm(previousState: any, formData: FormData) {
  const validationResult = await validateLoginForm(formData);

  if (!validationResult.success) {
    return validationResult.error.flatten();
  }

  await login(validationResult.data);
}
