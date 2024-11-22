import { cn } from "@/lib/utils";
import { memo } from "react";

const Placeholder = ({
  compact,
  value,
  className,
}: {
  compact?: boolean;
  value?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        className,
        "absolute top-0 left-0 h-full w-full text-sm text-gray-300 select-none pointer-events-none px-3 py-2",
        compact ? "leading-5 text-[13px]" : "leading-6 text-sm"
      )}
    >
      {value ||
        "Enter value"}
    </div>
  );
};

export default memo(Placeholder);
