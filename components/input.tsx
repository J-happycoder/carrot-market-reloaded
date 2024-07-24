import { InputHTMLAttributes } from "react";

interface InputProps {
  error?: string;
  name: string;
}

export default function Input({
  error,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <input
        className="bg-transparent border-0 border-b border-b-stone-500 shadow-lg focus:border-b-orange-400 focus:ring-0 transition-colors placeholder:text-stone-500"
        {...rest}
      />
      <span className="ml-1 text-red-500 font-medium text-sm">{error}</span>
    </div>
  );
}
