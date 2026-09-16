import { avatarHue, initials } from "@/lib/social";
import { cn } from "@/lib/utils";

export function Avatar({
  handle,
  name,
  className,
}: {
  handle: string;
  name: string;
  className?: string;
}) {
  const hue = avatarHue(handle);
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white/90 ring-1 ring-white/10",
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 38%), hsl(${(hue + 40) % 360} 60% 26%))`,
      }}
      title={`@${handle}`}
    >
      {initials(name)}
    </div>
  );
}

export function AvatarStack({
  members,
  max = 5,
  size = "size-7",
}: {
  members: { handle: string; name: string }[];
  max?: number;
  size?: string;
}) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((m) => (
        <Avatar
          key={m.handle}
          handle={m.handle}
          name={m.name}
          className={cn(size, "ring-2 ring-background")}
        />
      ))}
      {extra > 0 && (
        <div
          className={cn(
            size,
            "z-10 flex items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground ring-2 ring-background"
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
