export default function Loading() {
  return (
    <div className="max-w-xl mx-auto pb-24 flex flex-col animate-pulse divide-y divide-stone-800">
      {[...Array(10)].map((_, index) => (
        <div className="flex" key={index}>
          <div className="flex-none shrink-0 size-56 aspect-square bg-stone-600" />
          <div className="flex flex-col w-full px-3 py-2 gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium bg-stone-600 rounded-sm text-transparent w-fit">
                asdfkjsdkfjdf
              </span>
              <span className="text-xs break-words max-w-56 bg-stone-600 rounded-sm text-transparent w-fit">
                lskdfjlsdkjfsldkjfsldkfjsldkfjsldkjf
              </span>
            </div>

            <span className="text-sm font-semibold bg-stone-600 rounded-sm text-transparent w-fit">
              1000000
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
