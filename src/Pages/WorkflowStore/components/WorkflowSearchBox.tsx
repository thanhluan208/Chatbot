import { cn } from "@/lib/utils";
import { MaterialSymbolsSearchRounded } from "@/Pages/Publish/components/icon/material-symbols";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function WorkflowSearchBox() {
  const [getSearchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    setSearchText(getSearchParams.get('search') ?? '')
  }, []);

  function handleOnBlur() {
    setSearchParams((prev) => {
      prev.set('search', searchText)
      return prev
    })
  }

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchText(event?.target?.value ?? "");
  }

  function handleOnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if(event.key === "Enter") {
      (event.target as HTMLInputElement).blur();
    }
  }

  return (
    <div className="flex bg-[rgba(255,255,255,.2)] pl-[1rem] h-[2.5rem] rounded-[.5rem] overflow-hidden cursor-pointer">
      <input
        className="flex-1 bg-[transparent] !outline-none"
        onChange={handleOnChange}
        value={searchText}
        onBlur={handleOnBlur}
        onKeyDown={handleOnKeyDown}
      />
      <div
        className={cn(
          "h-[2.5rem] w-[3.5rem] p-0 text-[1.5rem]",
          "px-[1rem] bg-[transparent] flex items-center justify-center text-[white] outline-none border-none"
        )}
      >
        <MaterialSymbolsSearchRounded color="white" />
      </div>
    </div>
  );
}
