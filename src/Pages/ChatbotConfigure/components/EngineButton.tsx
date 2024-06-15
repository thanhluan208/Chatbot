import React, { Fragment, useId, useMemo } from "react";
import CommonStyles from "../../../Components/CommonStyles";
import { Paper, Popover, useTheme } from "@mui/material";
import EngineSelect from "./EngineSelect";
import { Formik } from "formik";
import GenerationDiversity from "./GenerationDiversity";
import Advance from "./GenerateDiversity/components/Advance";
import InputAndOutputSettings from "./InputAndOutputSettings";

export interface initialValueEngine {
  model: {
    label: string;
    avatar: string;
    group: string;
    value: string;
    tag: string;
  };
  generationDiversity: string;
  temperature: number;
  topP: number;
  dialogRound: number;
  responseLength: number;
  outputFormat: string;
}

const EngineButton = () => {
  //! State
  const theme = useTheme();
  const engineId = useId();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const initialValue: initialValueEngine = useMemo(() => {
    return {
      model: {
        label: "GPT-4",
        avatar:
          "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
        group: "OpenAI",
        value: "gpt-4",
        tag: "4k",
      },
      generationDiversity: "precise",
      temperature: 1.21,
      topP: 0.9,
      dialogRound: 3,
      responseLength: 2048,
      outputFormat: "text",
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? engineId : undefined;

  //! Function

  //! Render
  return (
    <Fragment>
      <CommonStyles.Button
        onClick={handleClick}
        sx={{
          gap: "8px",
          color: theme.colors.custom.colorDisabledTypo,
        }}
      >
        <img
          src="https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png"
          alt="GPT-4"
          height={16}
          width={16}
        />
        <CommonStyles.Typography type="normal12">GPT-4</CommonStyles.Typography>
      </CommonStyles.Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
            },
          },
        }}
      >
        <Paper
          sx={{
            padding: "24px",
            width: "480px",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Formik initialValues={initialValue} onSubmit={() => {}}>
            {() => {
              return (
                <Fragment>
                  <CommonStyles.Typography type="semiBold16" mb={"12px"}>
                    Model Configuration
                  </CommonStyles.Typography>
                  <EngineSelect />
                  <GenerationDiversity />
                  <Advance />
                  <InputAndOutputSettings />
                </Fragment>
              );
            }}
          </Formik>
        </Paper>
      </Popover>
    </Fragment>
  );
};

export default EngineButton;
