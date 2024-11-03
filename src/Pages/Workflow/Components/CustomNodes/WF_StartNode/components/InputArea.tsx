import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Box, Tooltip, useTheme } from "@mui/material";
import {
  ALargeSmall,
  CopyCheck,
  Edit,
  File,
  FileDigit,
  Files,
  Info,
  Link2,
  Rows4,
  Trash,
} from "lucide-react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { useReactFlow } from "@xyflow/react";
import { Variable } from "@/Types/workflow";
import AddOrEditInputDialog from "./AddOrEditInputDialog";
import { updateWorkflowNodeData } from "@/Constants/api";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const InputTypeList = [
  {
    name: "text",
    icon: <ALargeSmall />,
  },
  {
    name: "paragraph",
    icon: <Rows4 />,
  },
  {
    name: "choices",
    icon: <CopyCheck />,
  },
  {
    name: "number",
    icon: <FileDigit />,
  },
  {
    name: "file",
    icon: <File />,
  },
  {
    name: "list_file",
    icon: <Files />,
  },
];

interface InputAreaProps {
  nodeId: string;
  variables?: Variable[];
}

const InputArea = ({ nodeId, variables }: InputAreaProps) => {
  const { t } = useTranslation("node");
  const { updateNode, getNode } = useReactFlow();
  const { handleUpdateNodeData } = useWorkflowMutate();
  const { userId } = useAuth();
  const { workflowId } = useParams();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentInputdata, setCurrentInputData] = React.useState<
    unknown | null
  >(null);

  const theme = useTheme();

  const handleDelete = async (name: string) => {
    const curNode = getNode(nodeId);

    if (!curNode || !userId || !workflowId || !nodeId) return;

    const curVariables = curNode?.data?.variables as Variable[];
    const nextVariables = curVariables.filter((item) => item.variable !== name);

    const payload = {
      user_id: userId,
      workflow_id: workflowId,
      node_id: nodeId,
      node_data: {
        name: nodeId,
        desc: "",
        position: JSON.stringify(curNode?.position),
        variables: nextVariables,
      },
    };
    const response = await handleUpdateNodeData.mutateAsync(payload);

    if (response.status_code === 200) {
      updateNode(nodeId, {
        data: {
          ...curNode.data,
          variables: nextVariables,
        },
      });
    } else {
      toast.error(response.message);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setCurrentInputData(null);
  };

  return (
    <Fragment>
      {openDialog && (
        <AddOrEditInputDialog
          handleClose={handleClose}
          openDialog={openDialog}
          data={currentInputdata as Variable}
          nodeId={nodeId}
        />
      )}
      <CollapseArea
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {t("WF_Startnode.input")}

            <CommonStyles.Button
              isIcon
              hasBorder={false}
              onClick={() => setOpenDialog(true)}
            >
              <CommonIcons.Add />
            </CommonStyles.Button>
          </Box>
        }
      >
        <div className="flex flex-col gap-2">
          {variables?.map((input) => {
            return (
              <Box
                className="flex flex-col px-3 py-2 cursor-pointer nodrag relative overflow-hidden"
                key={input.label}
                sx={{
                  background: theme.colors.custom.background,
                  border: `1px solid ${theme.colors.custom.borderColor}`,
                  borderRadius: "8px",
                  button: {
                    height: "24px",
                    width: "24px",
                    svg: {
                      width: "14px",
                      height: "14px",
                    },
                  },
                  "&:hover": {
                    "& .action": {
                      width: "70px",
                      padding: "12px 8px",
                    },
                  },
                }}
              >
                {input.variable !== "BOT_USER_INPUT" && (
                  <div
                    className="action absolute h-full right-0 top-0  flex items-center gap-2 w-0 transition-all"
                    style={{
                      background: theme.colors.custom.backgroundCard,
                    }}
                  >
                    <CommonStyles.Button
                      isIcon
                      className="h-5 w-5"
                      onClick={() => {
                        setOpenDialog(true);
                        setCurrentInputData(input);
                      }}
                    >
                      <Edit />
                    </CommonStyles.Button>
                    <CommonStyles.Button
                      isIcon
                      className="h-5 w-5"
                      color="error"
                      onClick={() => handleDelete(input.variable)}
                    >
                      <Trash />
                    </CommonStyles.Button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 items-center ">
                    <Link2
                      className="w-5 h-5 translate-y-0.5"
                      color={theme.palette.primary.main}
                    />
                    <CommonStyles.Typography
                      type="semiBold16"
                      color={theme.palette.primary.main}
                    >
                      {input.label}
                      {input.required && (
                        <span
                          style={{
                            color: theme.colors.custom.colorErrorTypo,
                            marginLeft: "4px",
                          }}
                        >
                          *
                        </span>
                      )}
                    </CommonStyles.Typography>
                    <CommonStyles.Typography>
                      ({input?.max_length})
                    </CommonStyles.Typography>
                    {input?.hint && (
                      <Tooltip placement="top-start" title={input?.hint}>
                        <div>
                          <Info className="h-3 w-3 -translate-y-1" />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <CommonStyles.Typography>
                    {input?.type}
                  </CommonStyles.Typography>
                </div>
                <div className="mt-2">
                  {input?.description && (
                    <CommonStyles.Typography className="opacity-50">
                      {input?.description}
                    </CommonStyles.Typography>
                  )}
                </div>
              </Box>
            );
          })}
        </div>
      </CollapseArea>
    </Fragment>
  );
};

export default InputArea;
