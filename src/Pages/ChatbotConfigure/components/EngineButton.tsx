import React, { Fragment, useId, useMemo } from "react";
import CommonStyles from "../../../Components/CommonStyles";
import { Box, Paper, Popover, useTheme } from "@mui/material";
import EngineSelect from "./EngineSelect";
import { Form, Formik, FormikHelpers } from "formik";
import GenerationDiversity from "./GenerationDiversity";
import Advance from "./GenerateDiversity/components/Advance";
import InputAndOutputSettings from "./InputAndOutputSettings";
import { ModelOption, modelOptions } from "@/Constants/options";
import { useGet } from "@/Stores/useStore";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import CommonIcons from "@/Components/CommonIcons";
import { toast } from "react-toastify";
import httpServices from "@/Services/httpServices";
import { updateBotModel, updateBotParams } from "@/Constants/api";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";

export interface initialValueEngine {
  model: ModelOption;
  generationDiversity: string;
  temperature: number;
  top_p: number;
  history_turn: number;
  max_tokens: number;
  outputFormat: string;
}

const EngineButton = () => {
  //! State
  const theme: any = useTheme();
  const engineId = useId();
  const params = useParams();
  const { userId } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const botData: BotData = useGet("BOT_DATA");
  const refetchBotData = useGet("REFETCH_BOT_DATA");

  const initialValue: initialValueEngine = useMemo(() => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === botData?.llm?.model;
    });
    return {
      model: foundModel ?? modelOptions[5],
      generationDiversity: "precise",
      temperature: botData?.llm?.temperature ?? 1.21,
      top_p: botData?.llm?.top_p ?? 0.9,
      history_turn: botData?.llm?.history_turn ?? 3,
      max_tokens: botData?.llm?.max_tokens ?? 2048,
      outputFormat: "text",
    };
  }, [botData]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (
    values: initialValueEngine,
    formikHelper: FormikHelpers<initialValueEngine>
  ) => {
    if (!params?.botId || !userId) return;
    formikHelper.setSubmitting(true);
    const toastId = toast.loading("Saving..., please wait", {
      isLoading: true,
      autoClose: false,
    });

    try {
      const responseModel = await httpServices.post(updateBotModel, {
        bot_id: params.botId,
        user_id: userId,
        llm_name: values.model.value,
      });

      console.log("responseModel", responseModel);

      const responseParams = await httpServices.post(updateBotParams, {
        user_id: userId,
        bot_id: params.botId,
        model_params: {
          temperature: values?.temperature ?? values?.model?.temperature.default,
          top_p: values?.top_p ?? values.model.top_p?.default ?? 1,
          history_turn: values?.history_turn ?? values.model.history_turn.default,
          max_tokens: values?.max_tokens ?? values.model.max_tokens.default,
        },
      });

      console.log("responseParams", responseParams);

      refetchBotData && (await refetchBotData());

      toast.update(toastId, {
        isLoading: false,
        render: "Saved successfully",
        type: toast.TYPE.SUCCESS,
        autoClose: 2000,
      });
      formikHelper.setSubmitting(false);
    } catch (error) {
      console.log("error", error);
      toast.update(toastId, {
        isLoading: false,
        render: "Save failed",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
      });
      formikHelper.setSubmitting(false);
    }
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
          src={
            modelOptions.find((elm) => {
              return elm.value === botData?.llm?.model;
            })?.img ?? ""
          }
          alt="GPT-4"
          height={16}
          width={16}
          style={{ borderRadius: "12px" }}
        />
        <CommonStyles.Typography type="normal12">
          {modelOptions.find((elm) => {
            return elm.value === botData?.llm?.model;
          })?.label ?? ""}
        </CommonStyles.Typography>
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
            width: "520px",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Formik initialValues={initialValue} onSubmit={handleSubmit}>
            {({ isSubmitting }) => {
              return (
                <Form>
                  <CommonStyles.Typography type="semiBold16" mb={"12px"}>
                    Model Configuration
                  </CommonStyles.Typography>
                  <EngineSelect />
                  <GenerationDiversity />
                  <Advance />
                  <InputAndOutputSettings />
                  <Box
                    sx={{
                      marginTop: "20px",
                      justifyContent: "flex-end",
                      display: "flex",
                    }}
                  >
                    <CommonStyles.Button
                      variant="contained"
                      startIcon={<CommonIcons.Save />}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      Save
                    </CommonStyles.Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Paper>
      </Popover>
    </Fragment>
  );
};

export default EngineButton;
