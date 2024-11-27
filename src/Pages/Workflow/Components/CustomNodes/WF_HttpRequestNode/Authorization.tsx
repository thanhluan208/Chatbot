import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useReactFlow } from "@xyflow/react";
import { AuthorConfigType, AuthorType, NodeDataHTTPRequest } from "./type";
import { useCallback } from "react";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import CommonStyles from "@/Components/CommonStyles";
import { Switch, useTheme } from "@mui/material";
import { capitalize } from "lodash";
import AuthorDetail from "./AuthorDetail";

interface AuthorizationProps {
  nodeId: string;
}

const Authorization = ({ nodeId }: AuthorizationProps) => {
  const { getNode } = useReactFlow();
  const node = getNode(nodeId);
  const theme = useTheme();

  if (!node) return;

  const { handleUpdateNodeDataHttpRequest } = useWorkflowMutate();

  const nodeData = node?.data as unknown as NodeDataHTTPRequest;

  const handleChangeAuthorType = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      handleUpdateNodeDataHttpRequest(nodeId, {
        authorization: {
          type: checked ? AuthorType.API_KEY : AuthorType.NO_AUTH,
          config: checked
            ? {
                ...nodeData?.authorization?.config,
                type: AuthorConfigType.BASIC,
                api_key: "",
              }
            : nodeData?.authorization?.config,
        },
      });
    },
    [handleUpdateNodeDataHttpRequest, nodeData?.authorization?.config, nodeId]
  );

  const handleSelectAuthConfigType = useCallback(
    (value: AuthorConfigType) => {
      handleUpdateNodeDataHttpRequest(nodeId, {
        authorization: {
          type: nodeData?.authorization?.type,
          config: {
            ...nodeData?.authorization?.config,
            type: value,
          },
        },
      });
    },
    [
      handleUpdateNodeDataHttpRequest,
      nodeData?.authorization?.type,
      nodeData?.authorization?.config,
      nodeId,
    ]
  );

  const shouldDisplayConfig =
    nodeData?.authorization?.type === AuthorType.API_KEY;

  return (
    <CollapseArea
      label={
        <div className="flex w-full items-center justify-between">
          <CommonStyles.Typography type="semiBold16">
            Authorization
          </CommonStyles.Typography>

          <Switch
            checked={nodeData?.authorization.type === AuthorType.API_KEY}
            onChange={handleChangeAuthorType}
          />
        </div>
      }
    >
      {shouldDisplayConfig && (
        <div className="px-3">
          <CommonStyles.Typography type="semiBold16">
            Auth type
          </CommonStyles.Typography>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {Object.entries(AuthorConfigType).map(([key, value]) => {
              const isSelected =
                nodeData?.authorization?.config?.type === value;

              return (
                <CommonStyles.Button
                  key={key}
                  className="flex items-center py-2 rounded-lg justify-center transition-all"
                  style={{
                    border: `1px solid ${
                      isSelected
                        ? "transparent"
                        : theme.colors.custom.borderColor
                    }`,
                    background: isSelected
                      ? theme.palette.primary.main
                      : theme.colors.custom.background,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAuthConfigType(value);
                  }}
                >
                  <CommonStyles.Typography type="bold14">
                    {capitalize(value)}
                  </CommonStyles.Typography>
                </CommonStyles.Button>
              );
            })}
          </div>

          <AuthorDetail
            type={nodeData?.authorization?.config?.type}
            apiKey={nodeData?.authorization?.config?.api_key || ""}
            header={nodeData?.authorization?.config?.header || ""}
            nodeId={nodeId}
          />
        </div>
      )}
    </CollapseArea>
  );
};

export default Authorization;
