import { cn } from "@/lib/utils";
import { MouseEvent } from "react";

interface Props {
  itemCount: number;
}

interface DisplayOption {
  name: string;
  title: string;
  value: number;
}

const mockOption: DisplayOption[] = [
  {
    name: "",
    title: "",
    value: 0,
  },
];
export default function WorkflowDisplayElement({ itemCount }: Props) {
  function formatNumber(inputNumber: number): string {
    return "0K";
  }
  function handleAuthorClick(e: MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <div
      className={cn(
        "h-[auto] aspect-[1/1] rounded-[.5rem] bg-[rgba(255,255,255,.2)]",
        "box-border relative overflow-hidden",
        "[&:hover>.display-detail]:h-[100%]",
        "[&:hover>.display-detail]:bg-[rgba(0,0,0,.5)]"
      )}
      style={{
        width:
          itemCount === 1
            ? "100%"
            : `calc(100% / ${itemCount} - (${
                itemCount - 1
              } * 1rem / ${itemCount}))`,
      }}
    >
      <img
        src="https://random.imagecdn.app/500/500"
        className="w-[100%] h-[100%]"
      />
      <div
        className={cn(
          "absolute top-0 left-0 right-0 bottom-0",
          "shadow-[0px_0px_20px_inset_rgba(0,0,0)"
        )}
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0) 29%, rgba(0,0,0,0.8) 90%)",
        }}
      />
      <div
        className="display-detail flex flex-col absolute left-0 bottom-0 right-0 h-[66px] p-[.5rem] cursor-pointer overflow-hidden gap-[.5rem]"
        style={{
          transition: "1s",
        }}
      >
        <div className="flex w-[100%] gap-[.5rem]">
          <img
            src="https://i.pravatar.cc/500"
            className="ava-display flex-shrink-0 w-[50px] h-[50px] rounded-[.25rem] overflow-hidden"
          />
          <div className="flex-1 text-wrap font-bold flex flex-col overflow-hidden">
            <div className="text-ellipsis whitespace-nowrap overflow-hidden select-none">
              Workflowstore title
            </div>
            <div
              className="text-ellipsis whitespace-nowrap overflow-hidden select-none font-normal text-[.75rem] text-[rgb(150,150,150)] hover:underline"
              onClick={handleAuthorClick}
            >
              Author name
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <div
            className="absolute top-0 left-0 right-0 bottom-0 overflow-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            This is supper long description This is supper long description This
            is supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description This is
            supper long description This is supper long description
          </div>
        </div>
        <div className="flex h-[1.5rem] w-[100%] items-center justify-end gap-[1rem]">
          <div className="flex gap-[.5rem]"></div>
        </div>
      </div>
    </div>
  );
}
