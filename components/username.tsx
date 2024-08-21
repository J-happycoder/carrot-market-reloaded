import GithubIcon from "./github";

interface FormatUsernameProps {
  username: string;
  authType: "PASSWORD" | "GITHUB";
  textSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
}

export default function FormatUsername({
  username,
  authType,
  textSize,
}: FormatUsernameProps) {
  if (authType === "PASSWORD")
    return <span className={`text-${textSize}`}>{username}</span>;
  if (authType === "GITHUB")
    return (
      <div className="flex gap-1">
        <GithubIcon className="size-3" />
        <span>{username}</span>
      </div>
    );
}
