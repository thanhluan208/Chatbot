import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useReactFlow } from "@xyflow/react";
import { NodeDataHTTPRequest } from "./type";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import CommonStyles from "@/Components/CommonStyles";
import { useCallback } from "react";
import useDebounce from "@/Hooks/useDebounce";

interface TimeoutConfigProps {
  nodeId: string;
}

const TimeoutConfig = ({ nodeId }: TimeoutConfigProps) => {
  const { getNode } = useReactFlow();
  const node = getNode(nodeId);

  if (!node) return;

  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const nodeData = node?.data as unknown as NodeDataHTTPRequest;

  const handleChangeTimeout = useCallback(
    (value: string, key: string) => {
      const parseValue = Math.min(Math.max(Number(value), 0), 300);

      const timeout = nodeData?.timeout;
      if (parseValue === Number(timeout[key as keyof typeof timeout])) return;
      handleUpdateNodeDataHttpRequest(nodeId, {
        timeout: {
          connect: nodeData?.timeout?.connect,
          read: nodeData?.timeout?.read,
          write: nodeData?.timeout?.write,
          [key]: Math.min(Math.max(Number(value), 0), 300),
        },
      });
    },
    [
      handleUpdateNodeDataHttpRequest,
      nodeData?.timeout?.connect,
      nodeData?.timeout?.read,
      nodeData?.timeout?.write,
      nodeId,
    ]
  );

  const handleInputChange = useDebounce(handleChangeTimeout);

  return (
    <CollapseArea
      initOpen={false}
      label={
        <CommonStyles.Typography type="semiBold16">
          Timeout config
        </CommonStyles.Typography>
      }
    >
      <div className="px-3 grid grid-cols-3 gap-2">
        <CommonStyles.Input
          min={0}
          max={300}
          label="Connection timeout"
          placeholder="Enter connection timeout in second"
          afterOnchange={(e) => {
            handleInputChange(e.target.value, "connect");
          }}
          initValue={nodeData?.timeout?.connect}
          type="number"
        />
        <CommonStyles.Input
          min={0}
          max={300}
          label="Read timeout"
          placeholder="Enter read timeout in second"
          afterOnchange={(e) => {
            handleInputChange(e.target.value, "read");
          }}
          initValue={nodeData?.timeout?.read}
          type="number"
        />
        <CommonStyles.Input
          min={0}
          max={300}
          label="Write timeout"
          placeholder="Enter write timeout in second"
          afterOnchange={(e) => {
            handleInputChange(e.target.value, "write");
          }}
          initValue={nodeData?.timeout?.write}
          type="number"
        />
      </div>
    </CollapseArea>
  );
};

export default TimeoutConfig;
