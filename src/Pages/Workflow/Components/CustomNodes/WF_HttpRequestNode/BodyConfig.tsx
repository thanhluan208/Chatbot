import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useTheme } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { BodyType, NodeDataHTTPRequest } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import { capitalize } from "lodash";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import BodyConfigDetail from "./BodyConfigDetail";

interface BodyConfigProps {
  nodeId: string;
}

const BodyConfig = ({ nodeId }: BodyConfigProps) => {
  const { getNode } = useReactFlow();
  const node = getNode(nodeId);
  const theme = useTheme();

  if (!node) return;

  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const nodeData = node?.data as unknown as NodeDataHTTPRequest;

  const handleSelectBodyType = (value: BodyType) => {
    handleUpdateNodeDataHttpRequest(nodeId, {
      body: {
        data: nodeData?.body?.data,
        type: value,
      },
    });
  };

  return (
    <CollapseArea
      initOpen={nodeData?.body?.type !== BodyType.NONE}
      label={
        <CommonStyles.Typography type="semiBold16">
          Body
        </CommonStyles.Typography>
      }
    >
      <div className="flex flex-wrap gap-2">
        {Object.entries(BodyType).map(([key, value]) => {
          const isSelected = nodeData?.body?.type === value;

          return (
            <CommonStyles.Button
              key={key}
              className="flex items-center py-2 rounded-lg justify-center transition-all"
              style={{
                border: `1px solid ${
                  isSelected ? "transparent" : theme.colors.custom.borderColor
                }`,
                background: isSelected
                  ? theme.palette.primary.main
                  : theme.colors.custom.background,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectBodyType(value);
              }}
            >
              <CommonStyles.Typography type="bold14">
                {capitalize(value)}
              </CommonStyles.Typography>
            </CommonStyles.Button>
          );
        })}

        <div className="w-full">
          <BodyConfigDetail
            nodeId={nodeId}
            type={nodeData?.body?.type}
            bodyData={nodeData?.body?.data || ""}
          />
        </div>
      </div>
    </CollapseArea>
  );
};

export default BodyConfig;
