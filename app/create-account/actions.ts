"use server";

import db from "@/lib/db";
import { string, z } from "zod";
import bcrypt from "bcrypt";
import session from "@/lib/session";

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkIfUserAlreadyExists = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const usernameExists =
    (await db.user.count({
      where: {
        username,
      },
    })) > 0;
  if (usernameExists) return false;

  const emailExists =
    (await db.user.count({
      where: {
        email,
      },
    })) > 0;
  if (emailExists) return false;

  return true;
};

const joinDataSchema = z
  .object({
    username: z.string().min(1, "닉네임을 써주세요.").trim().toLowerCase(),
    email: z
      .string()
      .min(1, "이메일을 써주세요.")
      .email("올바른 형식으로 써주세요.")
      .trim()
      .toLowerCase(),
    password: z.string().min(4, "4자 이상으로 바꿔주세요.").trim(),
    confirm_password: z.string().trim(),
  })
  .refine(checkPassword, {
    message: "다시 확인해보세요.",
    path: ["confirm_password"],
  })
  .refine(checkIfUserAlreadyExists, { message: "이미 존재하는 계정이에요." });

async function validateJoinForm(formData: FormData) {
  const joinData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  return await joinDataSchema.safeParseAsync(joinData);
}

async function join({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      username,
      email,
      hashedPassword,
    },
    select: {
      id: true,
    },
  });
  session.set(user);
}

export async function handleJoinForm(previousState: any, formData: FormData) {
  const validationResult = await validateJoinForm(formData);

  if (!validationResult.success) {
    return validationResult.error.flatten();
  }

  await join(validationResult.data);
}
