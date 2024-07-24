"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";

interface SMSLoginFormState {
  sended: boolean;
  data?: {
    phone?: string;
    token?: string;
  };
  error?: {
    phone?: string[];
    token?: string[];
  };
}

export default function SMSLogin() {
  const [state, smsLoginAction] = useFormState<SMSLoginFormState, FormData>(
    smsLogin,
    {
      sended: false,
      error: { phone: undefined, token: undefined },
    }
  );

  return (
    <div className="px-5 py-8 flex flex-col gap-10 max-w-xl mx-auto">
      <div className="mt-24">
        <span className="text-2xl font-semibold">SMS 로그인</span>
      </div>
      <form action={smsLoginAction} className="flex flex-col gap-4">
        {state.sended ? (
          <div className="flex flex-col gap-0.5">
            <div className="text-sm">
              <span className="text-stone-400">전화번호 : </span>
              <span className="text-stone-100">{state.data?.phone}</span>
            </div>

            <Input
              key="token"
              name="token"
              type="text"
              required
              placeholder="인증번호"
              errors={state.error?.token}
            />
          </div>
        ) : (
          <Input
            key="phone"
            name="phone"
            type="text"
            required
            placeholder="전화번호"
            errors={state.error?.phone}
          />
        )}

        <Button text={state.sended ? "로그인" : "인증번호 전송"} />
      </form>
    </div>
  );
}
