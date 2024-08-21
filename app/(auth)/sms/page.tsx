"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { login, sendToken, verifyToken } from "./actions";
import { useState } from "react";

export default function SMSLogin() {
  const [status, setStatus] = useState<"NOT_SENDED" | "SENDED" | "VERIFIED">(
    "NOT_SENDED"
  );
  const [phone, setPhone] = useState<string>("");

  const [error, setError] = useState<string>();

  const smsLoginAction = async (formData: FormData) => {
    if (status === "NOT_SENDED") {
      const phoneString = formData.get("phone") + "";
      const { success, error } = await sendToken(phoneString);
      if (!success) {
        setError(error);
      } else {
        setError(undefined);
        setPhone(phoneString);
        setStatus("SENDED");
      }
    } else if (status === "SENDED") {
      const token = formData.get("token") + "";
      const { success, error } = await verifyToken(phone, token);
      if (!success) {
        setError(error);
      } else {
        setError(undefined);
        setStatus("VERIFIED");
      }
    } else if (status === "VERIFIED") {
      const username = formData.get("username") + "";
      await login(phone, username);
    }
  };

  return (
    <div className="px-5 py-8 flex flex-col gap-10 max-w-xl mx-auto">
      <div className="mt-24">
        <span className="text-2xl font-semibold">SMS 로그인</span>
      </div>
      <form action={smsLoginAction} className="flex flex-col gap-4">
        {status === "NOT_SENDED" && (
          <Input
            className="px-3 py-2 border border-stone-800 rounded-md focus:bg-stone-800 focus:border-stone-600"
            key="phone"
            name="phone"
            type="text"
            required
            placeholder="전화번호"
            error={error}
          />
        )}
        {status === "SENDED" && (
          <div className="flex flex-col gap-1">
            <div className="text-sm">
              <span className="text-stone-400">전화번호 : </span>
              <span className="text-stone-100">{phone}</span>
            </div>

            <Input
              className="px-3 py-2 border border-stone-800 rounded-md focus:bg-stone-800 focus:border-stone-600"
              key="token"
              name="token"
              type="text"
              required
              placeholder="인증코드"
              error={error}
            />
          </div>
        )}

        {status === "VERIFIED" && (
          <Input
            className="px-3 py-2 border border-stone-800 rounded-md focus:bg-stone-800 focus:border-stone-600"
            name="username"
            placeholder="닉네임"
            required
            type="text"
            key="username"
            error={error}
          />
        )}

        <Button
          text={
            status === "NOT_SENDED"
              ? "인증코드 전송"
              : status === "SENDED"
              ? "인증코드 확인"
              : "로그인"
          }
        />
      </form>
    </div>
  );
}
