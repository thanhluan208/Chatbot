import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Box, DialogContent, DialogTitle, useTheme } from "@mui/material";
import {
  ALargeSmall,
  CopyCheck,
  Edit,
  File,
  FileDigit,
  Files,
  Link2,
  Rows4,
  Trash,
} from "lucide-react";
import React, { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";
import InputText, { InputTextInitialValues } from "./InputText";
import InputChoices, { InputChoicesInitialValues } from "./InputChoices";
import InputFile, { InputFileInitialValues } from "./InputFile";
import { useReactFlow } from "@xyflow/react";

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
  inputs?: DefaultInputProps[];
}

export interface DefaultInputProps {
  input_name: string;
  input_label: string;
  is_required: boolean;
  type: string;
  id: string;
}

const InputArea = ({ nodeId, inputs }: InputAreaProps) => {
  const { t } = useTranslation("node");
  const { updateNode, getNode } = useReactFlow();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentInput, setCurrentInput] = React.useState("text");
  const [currentInputdata, setCurrentInputData] = React.useState<
    unknown | null
  >(null);

  const theme = useTheme();

  const handleDelete = (id: string) => {
    const currentNodeInput = getNode(nodeId)?.data
      ?.inputs as DefaultInputProps[];
    if (!currentNodeInput) return;

    const newInputs = currentNodeInput.filter((elm) => elm.id !== id);
    updateNode(nodeId, {
      data: {
        ...getNode(nodeId)?.data,
        inputs: newInputs,
      },
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
    setCurrentInputData(null);
  };

  const renderInputField = useCallback(() => {
    switch (currentInput) {
      case "text":
        return (
          <InputText
            type={currentInput}
            key={currentInput}
            nodeId={nodeId}
            setOpenDialog={handleClose}
            data={currentInputdata as InputTextInitialValues}
          />
        );
      case "paragraph":
        return (
          <InputText
            type={currentInput}
            key={currentInput}
            nodeId={nodeId}
            setOpenDialog={handleClose}
            data={currentInputdata as InputTextInitialValues}
          />
        );
      case "choices":
        return (
          <InputChoices
            type={currentInput}
            key={currentInput}
            nodeId={nodeId}
            setOpenDialog={handleClose}
            data={currentInputdata as InputChoicesInitialValues}
          />
        );
      case "number":
        return (
          <InputText
            type={currentInput}
            key={currentInput}
            nodeId={nodeId}
            setOpenDialog={handleClose}
            data={currentInputdata as InputTextInitialValues}
          />
        );
      case "file":
        return (
          <InputFile
            type={currentInput}
            key={currentInput}
            nodeId={nodeId}
            setOpenDialog={handleClose}
            data={currentInputdata as InputFileInitialValues}
          />
        );
      case "list_file":
        return (
          <InputFile
            type={currentInput}
            key={currentInput}
            nodeId={nodeId}
            setOpenDialog={handleClose}
            data={currentInputdata as InputFileInitialValues}
          />
        );
      default:
        return null;
    }
  }, [currentInput, nodeId, currentInputdata, handleClose]);

  return (
    <Fragment>
      {openDialog && (
        <CommonStyles.Dialog
          open={openDialog}
          toggle={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <Box>
            <DialogTitle>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={3}
              >
                <CommonStyles.Typography type="semiBold18">
                  {!currentInputdata
                    ? t("WF_Startnode.add_input_field")
                    : t("WF_Startnode.edit_input_field")}
                </CommonStyles.Typography>
                <CommonStyles.Button
                  isIcon
                  hasBorder={false}
                  onClick={handleClose}
                >
                  <CommonIcons.Clear />
                </CommonStyles.Button>
              </Box>
            </DialogTitle>

            <DialogContent className="flex flex-col gap-3 p-[20px 28px]">
              <div className="grid grid-cols-3 gap-2">
                {InputTypeList.map((elm) => {
                  const name = `WF_Startnode.${elm.name}`;
                  const isActive = elm.name === currentInput;

                  return (
                    <Box
                      key={elm.name}
                      onClick={() => setCurrentInput(elm.name)}
                      className="flex flex-col items-center  gap-2 justify-center p-2 rounded-md cursor-pointer transition-all"
                      sx={{
                        background: theme.colors.custom.background,
                        border: `1px solid ${
                          isActive
                            ? theme.palette.primary.main
                            : theme.colors.custom.borderColor
                        }`,
                        "&:hover": {
                          background: theme.colors.custom.backgroundCard,
                        },
                      }}
                    >
                      {elm.icon}
                      <CommonStyles.Typography>
                        {t(name as unknown as TemplateStringsArray)}
                      </CommonStyles.Typography>
                    </Box>
                  );
                })}
              </div>

              <div className="mt-5">{renderInputField()}</div>
            </DialogContent>
          </Box>
        </CommonStyles.Dialog>
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
          {inputs?.map((input) => {
            const icon = InputTypeList.find((elm) => elm.name === input.type);
            return (
              <Box
                className="flex items-center justify-between px-3 py-2 cursor-pointer nodrag relative overflow-hidden"
                key={input.id}
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
                    onClick={() => handleDelete(input.id)}
                  >
                    <Trash />
                  </CommonStyles.Button>
                </div>
                <div className="flex gap-1 items-center ">
                  <Link2
                    className="w-5 h-5 translate-y-0.5"
                    color={theme.palette.primary.main}
                  />
                  <CommonStyles.Typography
                    type="semiBold16"
                    color={theme.palette.primary.main}
                  >
                    {input.input_name}
                    {input.is_required && (
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
                </div>
                {icon && icon?.icon}
              </Box>
            );
          })}
        </div>
      </CollapseArea>
    </Fragment>
  );
};

export default InputArea;
