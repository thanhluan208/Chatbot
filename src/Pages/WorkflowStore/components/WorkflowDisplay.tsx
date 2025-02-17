import { useEffect, useRef, useState } from "react";
import WorkflowDisplayElement from "./WorkflowDisplayElement";
import { useGetWorkflowStore } from "@/Hooks/workflow-store/useGetWorkflowStore";
import { useSearchParams } from "react-router-dom";
import { Workflow } from "@/Types/workflow";

export default function WorkflowDisplay() {
  const containerEle = useRef<HTMLInputElement | null>(null);
  const [itemCount, setItemCount] = useState<number>(0);
  const [data, setData] = useState<Workflow[]>([]);

  const [getSearchParam] = useSearchParams();
  const [_, { data: getWorkflowStoreResponse }] = useGetWorkflowStore({
    payload: {
      user_id: "invalid-id",
      visual_option: "invalid-id-visual",
      search_filter: getSearchParam.get("search") ?? "",
      catafories_filter: getSearchParam.get("filter") ?? "",
    },
  });
  useEffect(() => {
    if (!containerEle.current) return;

    const obsFunc = new ResizeObserver(([entry]) => {
      if (entry) {
        const newWidth = entry.contentRect.width;
        const res = Math.floor(newWidth / 300);
        setItemCount(res === 0 ? 1 : res);
      }
    });

    if (containerEle.current) {
      obsFunc.observe(containerEle.current);
    }

    return () => {
      obsFunc.disconnect();
    };
  }, [containerEle.current]);

  useEffect(() => {
    setData(getWorkflowStoreResponse?.list_workflows ?? []);
  }, [getWorkflowStoreResponse]);

  return (
    <div className="flex flex-wrap gap-[1rem] !max-w-[100%]" ref={containerEle}>
      {data.map((item, i) => {
        console.log(i);

        return (
          <WorkflowDisplayElement
            itemCount={itemCount}
            key={`user-${item.owner_id}workflow-${item.workflow_id}`}
            {...item}
          />
        );
      })}
    </div>
  );
}
