"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, "올바른 전화번호를 입력해 주세요.");

const tokenSchema = z.string().trim();

export async function smsLogin(previousState: any, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!previousState?.sended) {
    const validated = phoneSchema.safeParse(phone);
    if (!validated.success)
      return {
        sended: false,
        error: { phone: validated.error.flatten().formErrors },
      };
    // Send SMS
    return { sended: true, phone };
  } else {
    const validated = tokenSchema.safeParse(token);
    if (!validated.success)
      return {
        sended: true,
        error: { token: validated.error.flatten().formErrors },
      };
    // Confirm and log the user in.
    console.log("log the user in!");
    return previousState;
  }
}
