import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Box, DialogContent, DialogTitle, useTheme } from "@mui/material";
import {
  ALargeSmall,
  CopyCheck,
  File,
  FileDigit,
  Files,
  Rows4,
} from "lucide-react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import InputText from "./InputText";
import InputChoices from "./InputChoices";
import InputFile from "./InputFile";

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

const InputArea = () => {
  const { t } = useTranslation("node");

  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentInput, setCurrentInput] = React.useState("text");

  const theme = useTheme();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const renderInputField = () => {
    switch (currentInput) {
      case "text":
        return <InputText type={currentInput} key={currentInput}/>;
      case "paragraph":
        return <InputText type={currentInput} key={currentInput}/>;
      case "choices":
        return <InputChoices type={currentInput} key={currentInput}/>;
      case "number":
        return <InputText type={currentInput} key={currentInput}/>;
      case "file":
        return <InputFile type={currentInput} key={currentInput}/>;
      case "list_file":
        return <InputFile type={currentInput} key={currentInput}/>;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      {openDialog && (
        <CommonStyles.Dialog
          open={openDialog}
          toggle={handleCloseDialog}
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
                  {t("WF_Startnode.add_input_field")}
                </CommonStyles.Typography>
                <CommonStyles.Button
                  isIcon
                  hasBorder={false}
                  onClick={handleCloseDialog}
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
      ></CollapseArea>
    </Fragment>
  );
};

export default InputArea;
