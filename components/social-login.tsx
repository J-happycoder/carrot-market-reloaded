import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { GithubIcon } from "./github";

export default function SocialLogin() {
  return (
    <>
      <div className="flex flex-col items-center gap-5">
        <span className="text-sm font-medium text-stone-300">
          다음으로 계속하기
        </span>
        <div className="w-full grid grid-cols-3">
          <Link
            href="/sms"
            className="flex flex-col items-center justify-center gap-2 group"
          >
            <div className="bg-stone-200 size-14 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
              <ChatBubbleBottomCenterTextIcon className="size-6 text-black" />
            </div>
            <span className="text-sm text-stone-200 group-hover:text-white transition-colors">
              SMS
            </span>
          </Link>
          <Link
            href="/github/start"
            className="flex flex-col items-center justify-center gap-2 group"
          >
            <div className="bg-stone-200 size-14 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
              <GithubIcon className="size-6" />
            </div>
            <span className="text-sm text-stone-200 group-hover:text-white transition-colors">
              Github
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
