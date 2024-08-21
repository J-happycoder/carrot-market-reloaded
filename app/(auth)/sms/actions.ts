"use server";

import { z } from "zod";
import validator from "validator";
import db from "@/lib/db";
import { generateRandomText } from "@/lib/utils";
import { setSession } from "@/lib/session";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, "올바른 전화번호를 입력해 주세요.");

const tokenSchema = z.string().trim();

async function sendSMS(text: string, phone: string) {
  console.log(phone, text);
}

async function createToken(phone: string) {
  const text = generateRandomText(6);
  const token = await db.token.create({
    data: {
      text,
      user: {
        connectOrCreate: {
          where: {
            phone,
            authType: "SMS",
          },
          create: {
            phone,
            username: "",
            authType: "SMS",
          },
        },
      },
    },
  });
  return token.text;
}

export async function sendToken(phone: string) {
  const result = phoneSchema.safeParse(phone);
  if (!result.success)
    return { success: false, error: result.error.flatten().formErrors[0] };

  const tokenText = await createToken(phone);
  await sendSMS(tokenText, phone);

  return { success: true };
}

export async function verifyToken(phone: string, token: string) {
  const result = tokenSchema.safeParse(token);
  if (!result.success)
    return { success: false, error: result.error.flatten().formErrors[0] };

  const existingToken = await db.token.findFirst({
    where: {
      text: result.data,
      user: { phone },
    },
    select: {
      userId: true,
    },
  });

  if (!existingToken)
    return {
      success: false,
      error: "인증코드가 틀렸어요.",
    };

  await db.token.deleteMany({
    where: {
      user: {
        id: existingToken.userId,
      },
    },
  });

  return { success: true };
}

export async function login(phone: string, username: string) {
  const user = await db.user.update({
    where: {
      phone,
    },
    data: {
      username,
    },
    select: {
      id: true,
    },
  });
  await setSession(user);
  redirect("/profile");
}
