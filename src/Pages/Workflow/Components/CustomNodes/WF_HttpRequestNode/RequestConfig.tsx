import { useReactFlow } from "@xyflow/react";
import { HttpMethod, NodeDataHTTPRequest } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import { useCallback, useMemo, useRef } from "react";
import EditorPrompt from "../../misc/EditorPromtpt";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";

interface RequestConfigProps {
  nodeId: string;
}

const RequestConfig = ({ nodeId }: RequestConfigProps) => {
  const { getNode } = useReactFlow();
  const node = getNode(nodeId);

  if (!node) return;

  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const nodeData = node?.data as unknown as NodeDataHTTPRequest;

  const methodOptions = useMemo(() => {
    return Object.entries(HttpMethod).map(([key, value]) => {
      return {
        value: value,
        label: key,
      };
    });
  }, []);

  const handleChangeUrl = useCallback(
    (id: string, value: string) => {
      if (value === nodeData?.url) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        handleUpdateNodeDataHttpRequest(id, {
          url: value,
        });
      }, 300);
    },
    [nodeData?.url, handleUpdateNodeDataHttpRequest]
  );

  const handleSelectMethod = useCallback(
    (value: string) => {
      if (value === nodeData?.method) return;
      handleUpdateNodeDataHttpRequest(node?.id, {
        method: value,
      });
    },
    [handleUpdateNodeDataHttpRequest, node?.id, nodeData?.method]
  );

  return (
    <div className="flex  gap-2 items-end">
      <CommonStyles.Select
        label="Method"
        handleChange={handleSelectMethod}
        value={nodeData?.method}
        options={methodOptions}
        sx={{
          height: "50px",
        }}
      />
      <div className="w-full">
        <div className="flex w-full flex-col">
          <CommonStyles.Typography type="bold14">
            Request url
          </CommonStyles.Typography>
          <EditorPrompt
            id={nodeId}
            nodeId={nodeId}
            value={nodeData?.url}
            handleChangeEditor={handleChangeUrl}
            className="min-h-10"
            placeholder="Enter request url..."
          />
        </div>
      </div>
    </div>
  );
};

export default RequestConfig;
