import { cn } from "@/lib/utils";
import { MaterialSymbolsStarRounded, MaterialSymbolsTrendingUpRounded, MaterialSymbolsUpload2Rounded } from "@/Pages/Publish/components/icon/material-symbols";
import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export interface FilterOption {
  name: string;
  title: string;
  icon?: ReactNode;
}

const filterOptions: FilterOption[] = [
  {
    name: "recently-add",
    title: "Recently Add",
    icon: <MaterialSymbolsStarRounded />,
  },
  { name: "recently-update", title: "Recently Update", icon: <MaterialSymbolsUpload2Rounded /> },
  { name: "most-downloaded", title: "Most Downloaded", icon: <MaterialSymbolsTrendingUpRounded /> },
  // { title: "", icon: <Fragment /> },
];

export default function WorkflowFilter() {
  const [getSearchParam, setSearchParam] = useSearchParams();

  function handleSelectFilter(filterName: string) {
    return () => {
      setSearchParam((prev) => {
        prev.set('filter',prev.get('filter') === filterName? '' : filterName)
        return prev
      });
    };
  }

  return (
    <div className="flex gap-[1rem]">
      {filterOptions.map((filterOption) => (
        <div
          className={cn(
            "flex border-[2px] items-center px-[.5rem] min-w-[175px] h-[2rem] rounded-[.5rem] gap-[.5rem]",
            "border-[rgba(255,255,255,.2)] cursor-pointer text-[rgba(255,255,255,.2)]",
            {
              " border-white bg-[rgba(255,255,255,.2)] text-white":
                getSearchParam.get("filter") &&
                getSearchParam.get("filter") === filterOption.name,
            }
          )}
          onClick={handleSelectFilter(filterOption.name)}
        >
          {filterOption.icon && (
            <div className="w-[1.5rem] h-[1.5rem] flex items-center justify-center text-[1.5rem]">
              {filterOption.icon}
            </div>
          )}
          <div>{filterOption.title}</div>
        </div>
      ))}
    </div>
  );
}
