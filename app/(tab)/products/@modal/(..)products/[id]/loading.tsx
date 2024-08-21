export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-xl backdrop-brightness-50 z-50 flex items-center justify-center p-20">
      <div className="max-w-xl w-full flex flex-col relative bg-stone-800 bg-opacity-40 shadow-2xl shadow-stone-900 animate-pulse">
        <div className="relative w-full aspect-square sm:aspect-video bg-stone-500" />
        <div className="px-8 py-20 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <span className="text-4xl text-transparent bg-stone-500 rounded-sm">
              sdfsdfsdfsd
            </span>
            <span className="text-transparent bg-stone-500 rounded-sm">
              100000
            </span>
          </div>
          <span className="text-xs text-transparent rounded-sm bg-stone-500 mb-5 w-fit">
            asdf
          </span>
          <span className="mb-1 w-fit max-w-full overflow-hidden text-sm text-transparent rounded-sm bg-stone-500">
            adsfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd
          </span>
          <span className="w-fit max-w-full text-sm text-transparent rounded-sm bg-stone-500">
            adsfadsfadsasdfasdfasdfadsfasdfsd
          </span>
        </div>
        <div className="absolute bottom-5"></div>
      </div>
    </div>
  );
}
