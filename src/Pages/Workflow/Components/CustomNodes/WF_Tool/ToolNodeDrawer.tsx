import toolConfig from "@/assets/tool.yaml";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import cachedKeys from "@/Constants/cachedKeys";
import useDebounce from "@/Hooks/useDebounce";
import useCheckToolAuthor from "@/Hooks/workflow/useCheckToolAuthor";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useSave } from "@/Stores/useStore";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { capitalize, cloneDeep } from "lodash";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import DescriptionInput from "../../DescriptionInput";
import EditorPromtpt from "../../misc/EditorPromtpt";
import VarOutList from "../../misc/VarOutList";
import { Tool } from "../../Toolbar/type";
import AuthorizeButton from "./AuthorizeButton";
import { NodeDataTool } from "./type";

interface ToolNodeDrawerProps {
  node?: NodeProps;
}
const ToolNodeDrawer = ({ node }: ToolNodeDrawerProps) => {
  const save = useSave();
  const { userId } = useAuth();
  const {} = useWorkflowMutate();
  const { updateNode } = useReactFlow();

  const { handleUpdateNodeDataTool } = useWorkflowMutate();

  if (!node || !userId) return null;

  const nodeData = node?.data as unknown as NodeDataTool;

  const checkToolPayload = useMemo(() => {
    return {
      user_id: userId,
      tool_name: nodeData?.tool_name,
      tool_provider: nodeData?.provider_id,
    };
  }, [userId, nodeData?.provider_id, nodeData?.tool_name]);

  const provider = useMemo(() => {
    return toolConfig[nodeData?.provider_id];
  }, [nodeData?.provider_id]);

  const tool = useMemo<Tool>(() => {
    return provider[nodeData?.tool_name];
  }, [nodeData?.tool_name]);

  const { data: toolStatus, isLoading } = useCheckToolAuthor(
    checkToolPayload,
    !nodeData.provider_credentials_valid
  );

  const handleUpdate = (payload: Partial<NodeDataTool>) => {
    handleUpdateNodeDataTool(node?.id, payload);
  };

  const handleUpdateParam = (
    paramName: string,
    value: string,
    type: string
  ) => {
    handleUpdateNodeDataTool(node?.id, {
      tool_parameters: {
        [paramName]: {
          value,
          type,
        },
      },
    });
  };

  const handleInputChange = useDebounce(handleUpdateParam);

  useEffect(() => {
    if (
      (toolStatus?.is_valid && !nodeData.provider_credentials_valid) ||
      (!toolStatus?.is_valid && nodeData.provider_credentials_valid)
    ) {
      updateNode(node.id, {
        data: {
          ...node.data,
          provider_credentials_valid: toolStatus?.is_valid,
        },
      });
    }
  }, [toolStatus?.is_valid, nodeData, node.id]);

  return (
    <div
      className="py-4"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col  sticky top-0 px-6 py-4 z-50 backdrop-blur-3xl">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 h-10">
            <img
              src={provider.identity.icon}
              alt="icon"
              className="rounded-lg w-6 h-6"
            />
            <CommonStyles.Typography
              type="semiBold16"
              sx={{
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {nodeData?.tool_name}
            </CommonStyles.Typography>
          </div>

          <CommonStyles.Button
            isIcon
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            onClick={() => {
              save(cachedKeys.NODE_EDITING, null);
            }}
          >
            <X size={24} />
          </CommonStyles.Button>
        </div>
        <DescriptionInput value={nodeData.desc} handleUpdate={handleUpdate} />
      </div>

      {provider?.credentials_for_provider &&
        !nodeData.provider_credentials_valid &&
        !isLoading && (
          <AuthorizeButton
            credential={provider.credentials_for_provider}
            provider={nodeData?.provider_id}
            toolName={nodeData?.tool_name}
          />
        )}
      <div className="px-3">
        <CollapseArea
          initOpen
          label={
            <CommonStyles.Typography type="semiBold16">
              Input variables
            </CommonStyles.Typography>
          }
        >
          {Object.values(
            cloneDeep(tool.parameters).map((param) => {
              const foundParam = Object.keys(nodeData?.tool_parameters).find(
                (elm) => elm === param.name
              );

              if (!foundParam) return null;
              return (
                <div>
                  <CommonStyles.Typography type="bold14" my={1}>
                    {capitalize(param?.label.en_US)}
                    {param?.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </CommonStyles.Typography>
                  <EditorPromtpt
                    id={`${node?.id}-${param.name}`}
                    nodeId={node?.id}
                    value={nodeData?.tool_parameters[param.name].value || ""}
                    handleChangeEditor={(_, value) => {
                      handleInputChange(
                        param.name,
                        value,
                        nodeData?.tool_parameters[param.name].type
                      );
                    }}
                    className="min-h-10"
                  />
                </div>
              );
            })
          )}
        </CollapseArea>
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-3">
        <VarOutList nodeData={nodeData} />
      </div>
    </div>
  );
};

export default ToolNodeDrawer;
