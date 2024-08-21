"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleJoinForm } from "./actions";
import Button from "@/components/button";

export default function CreateAccount() {
  const [joinState, joinAction] = useFormState(handleJoinForm, null);
  return (
    <div className="px-5 py-8 flex flex-col gap-10 max-w-xl mx-auto">
      <div className="mt-24">
        <span className="text-2xl font-semibold">당근마켓 가입하기</span>
      </div>
      <form action={joinAction} className="flex flex-col gap-4">
        <span className="ml-1 text-red-500 font-medium text-sm">
          {joinState?.formErrors[0]}
        </span>
        <div className="flex flex-col gap-2">
          <Input
            className="focus:bg-stone-800 focus:border-stone-600 p-2 border border-stone-700 rounded-md"
            type="text"
            placeholder="닉네임"
            name="username"
            error={
              joinState?.fieldErrors.username &&
              joinState?.fieldErrors.username[0]
            }
          />
          <Input
            className="focus:bg-stone-800 focus:border-stone-600 p-2 border border-stone-700 rounded-md"
            type="text"
            placeholder="이메일"
            name="email"
            error={
              joinState?.fieldErrors.email && joinState?.fieldErrors.email[0]
            }
          />
          <Input
            className="focus:bg-stone-800 focus:border-stone-600 p-2 border border-stone-700 rounded-md"
            type="password"
            placeholder="비밀번호"
            name="password"
            error={
              joinState?.fieldErrors.password &&
              joinState?.fieldErrors.password[0]
            }
          />
          <Input
            className="focus:bg-stone-800 focus:border-stone-600 p-2 border border-stone-700 rounded-md"
            type="password"
            placeholder="비밀번호 확인하기"
            name="confirm_password"
            error={
              joinState?.fieldErrors.confirm_password &&
              joinState?.fieldErrors.confirm_password[0]
            }
          />
        </div>
        <Button text="계정 만들기" />
      </form>
      <div className="w-full bg-stone-500 h-px" />
      <SocialLogin />
    </div>
  );
}
