import { InputHTMLAttributes } from "react";

interface InputProps {
  error?: string;
  name: string;
}

export default function Input({
  error,
  className,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        className={
          "bg-transparent focus:outline-none transition-colors placeholder:text-stone-500 text-sm " +
          className
        }
        {...rest}
      />
      {error && (
        <span className="ml-1 text-red-500 font-medium text-sm">{error}</span>
      )}
    </div>
  );
}
