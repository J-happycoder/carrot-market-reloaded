"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleLoginForm } from "./actions";
import Button from "@/components/button";

export default function Login() {
  const [loginState, loginAction] = useFormState(handleLoginForm, null);
  return (
    <div className="px-5 py-8 flex flex-col gap-10 max-w-xl mx-auto">
      <div className="mt-24">
        <span className="text-2xl font-semibold">로그인</span>
      </div>
      <form action={loginAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Input
            className="focus:bg-stone-800 focus:border-stone-600 p-2 border border-stone-700 rounded-md"
            type="email"
            required
            placeholder="이메일"
            name="email"
            error={
              loginState?.fieldErrors.email && loginState?.fieldErrors.email[0]
            }
          />
          <Input
            className="focus:bg-stone-800 focus:border-stone-600 p-2 border border-stone-700 rounded-md"
            type="password"
            required
            placeholder="비밀번호"
            name="password"
            error={
              loginState?.fieldErrors.password &&
              loginState?.fieldErrors.password[0]
            }
          />
        </div>
        <Button text="로그인" />
      </form>
      <div className="w-full bg-stone-500 h-px" />
      <SocialLogin />
    </div>
  );
}
