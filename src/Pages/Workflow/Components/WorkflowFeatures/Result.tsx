import { SESSION_STORAGE_KEY } from "@/Constants/common";
import { useGet } from "@/Stores/useStore";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import ResultItem from "./ResultItem";
import { ResponseRunWorkflow } from "./type";

export interface Result {
  variable: string;
  value: string;
}

const Result = () => {
  const workflowResult = useGet("WORKFLOW_RESULT") as ResponseRunWorkflow;
  const [listResult, setListResult] = useState<Result[]>([]);

  const disabledAnimate = sessionStorage.getItem(
    SESSION_STORAGE_KEY.WORKFLOW_RESULT_ANIMATED
  );

  const parsedWorkflowResult = useMemo(() => {
    if (!workflowResult.outputs) return [];

    const arr = Object.entries(workflowResult.outputs).map(([key, value]) => {
      return {
        variable: key,
        value: value || "",
      };
    });

    return arr.filter((res) => res.value);
  }, [workflowResult]);

  const handleAddresult = useCallback(() => {
    if (parsedWorkflowResult.length === listResult.length) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY.WORKFLOW_RESULT_ANIMATED,
        "true"
      );
      return;
    }
    setListResult((prev) => {
      return [...prev, parsedWorkflowResult[prev.length]];
    });
  }, [parsedWorkflowResult, listResult]);

  useEffect(() => {
    if (disabledAnimate) {
      setListResult(parsedWorkflowResult);
      return;
    }
    if (!isEmpty(parsedWorkflowResult)) {
      setListResult([parsedWorkflowResult[0]]);
    }
  }, [parsedWorkflowResult]);

  return (
    <div className="flex flex-col gap-2">
      {listResult.map((res) => {
        if (!res?.value) return null;
        return (
          <ResultItem
            key={res?.variable}
            handleAddresult={handleAddresult}
            result={res?.value}
            shouldAnimate={!disabledAnimate}
          />
        );
      })}
    </div>
  );
};

export default Result;
