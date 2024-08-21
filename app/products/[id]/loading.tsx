export default function Loading() {
  return (
    <div className="flex flex-col max-w-xl mx-auto animate-pulse">
      <div className="bg-stone-500 w-full aspect-video max-w-xl" />
      <div className="px-3 py-5 flex items-center gap-3">
        <div className="bg-stone-500 size-12 rounded-full" />
        <div className="flex flex-col items-start gap-1">
          <span className="text-transparent bg-stone-500 text-xs rounded-sm">
            asdfsdfsdfsdfdfdfdfd
          </span>
          <span className="text-transparent bg-stone-500 text-xs rounded-sm">
            sdfsdfdfdf
          </span>
        </div>
      </div>
      <div className="h-px bg-stone-700 w-full" />
    </div>
  );
}
