import { MapPinIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 py-8 max-w-xl mx-auto">
      <div className="flex flex-col my-auto gap-5">
        <span className="text-orange-500 flex justify-center">
          <MapPinIcon className="size-28" />
        </span>
        <div className="flex flex-col">
          <span className="text-3xl font-semibold text-center">
            당근 마켓에 오신 것을
          </span>
          <span className="text-3xl font-semibold text-center">
            환영합니다!
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-3">
        <Link
          href="/create-account"
          className="button bg-orange-500 hover:bg-orange-400 py-3 text-base font-semibold"
        >
          시작하기
        </Link>
        <div className="space-x-1.5">
          <span className="text-base">이미 계정이 있나요?</span>
          <Link
            href="/login"
            className="text-base text-orange-400 hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
