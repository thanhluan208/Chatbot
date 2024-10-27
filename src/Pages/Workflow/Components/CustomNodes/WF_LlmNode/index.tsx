import React, { useMemo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import { Component } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Form, Formik } from "formik";
import { modelOptions } from "@/Constants/options";
import CommonStyles from "@/Components/CommonStyles";
import EngineSelect from "../LLMNode/SingleTab/EngineSelect";
import GenerationDiversity from "@/Pages/ChatbotConfigure/components/GenerationDiversity";
import Advance from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Advance";
import InputAndOutputSettings from "@/Pages/ChatbotConfigure/components/InputAndOutputSettings";
import CommonIcons from "@/Components/CommonIcons";
import { useTranslation } from "react-i18next";

const WF_StartNode = ({
  data,
  id,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps) => {
  //! State
  const theme = useTheme();
  const { t } = useTranslation("node");

  const handleid = useMemo(() => {
    return uuid();
  }, []);

  const initialValues = useMemo(() => {
    const botData: any = {
      llm: data.llm,
      scenario: data.scenario,
      system_prompt: data.system_prompt,
    };

    const foundModel = modelOptions.find((elm) => {
      return elm.value === botData?.llm?.model;
    });
    return {
      scenario: botData?.scenario ?? "",
      system_prompt: botData?.system_prompt ?? "",
      model: foundModel ?? modelOptions[0],
      generationDiversity: "precise",
      temperature: botData?.llm?.temperature ?? 1.21,
      top_p: botData?.llm?.top_p ?? 0.9,
      history_turn: botData?.llm?.history_turn ?? 3,
      max_tokens: botData?.llm?.max_tokens ?? 2048,
      frequency_penalty: botData?.llm?.frequency_penalty ?? 0,
      presence_penalty: botData?.llm?.presence_penalty ?? 0,
    };
  }, [data]);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: theme.colors.custom.backgroundCard,
        border: "solid 2px transparent",
        width: "600px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
      }}
    >
      <CollapseArea
        sxContainer={{ marginTop: 0 }}
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Box
              sx={{
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                background: theme.palette.primary.main,
              }}
            >
              <Component className="w-3.5 h-3.5" />
            </Box>
            <EditLabelNode
              data={data}
              nodeId={id}
              positionAbsoluteX={positionAbsoluteX}
              positionAbsoluteY={positionAbsoluteY}
            />
          </Box>
        }
      >
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          {({ isSubmitting }) => {
            return (
              <Form>
                <CollapseArea
                  nodeId={id}
                  dataKey="modelConfiguration"
                  initOpen={!!data?.currentNode}
                  key={data?.currentNode + id + "modelConfiguration"}
                  label={
                    <CommonStyles.Typography type="semiBold14">
                      {t("WF_Startnode.mode_configuration")}
                    </CommonStyles.Typography>
                  }
                >
                  <EngineSelect name="model" />
                  <GenerationDiversity />
                  <Advance />
                  <InputAndOutputSettings />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <CommonStyles.Button
                      variant="contained"
                      type="submit"
                      startIcon={<CommonIcons.Save />}
                      disabled={isSubmitting}
                    >
                      Save
                    </CommonStyles.Button>
                  </Box>
                </CollapseArea>

                <CollapseArea
                  nodeId={id}
                  dataKey="llmContext"
                  initOpen={!!data?.currentNode}
                  key={data?.currentNode + id + "llmContext"}
                  label={
                    <CommonStyles.Typography type="semiBold14">
                      {t("WF_Startnode.context")}
                    </CommonStyles.Typography>
                  }
                ></CollapseArea>
              </Form>
            );
          }}
        </Formik>
      </CollapseArea>

      <Handle
        type="source"
        position={Position.Right}
        id={handleid}
        isConnectable={true}
        className="handle"
      />
    </Box>
  );
};

export default React.memo(WF_StartNode);
