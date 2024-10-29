import { Box, useTheme } from "@mui/material";
import { Handle, NodeProps, Position } from "@xyflow/react";
import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import GradientBorder from "../../GradientBorder";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Component, MessageSquareQuote } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import InputArea, { DefaultInputProps } from "../WF_StartNode/components/InputArea";
import CommonStyles from "@/Components/CommonStyles";
import Editor from "../WF_LlmNode/Editor";
import { Form, Formik } from "formik";

const WF_AnswerNode = (props: NodeProps) => {
    //! State
    const {data, id, positionAbsoluteX, positionAbsoluteY} = props;
    const theme = useTheme();
    const {t} = useTranslation("node");

    // const initialValues = useMemo(() => {
    //     const botData: any = {

    //     }
    // })

    //! Render
    return (
        <Fragment>
            <GradientBorder {...props}>
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
                                <MessageSquareQuote className="w-3.5 h-3.5" color="#fff"/>
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
                    <Formik initialValues={{}} onSubmit={() => {}}>
                        {() => {
                        return (
                            <Form>
                                <CollapseArea
                                    nodeId={id}
                                    label={
                                    <CommonStyles.Typography type="semiBold14">
                                        {t("WF_AnswerNode.answer")}
                                    </CommonStyles.Typography>
                                    }
                                >
                                    <div className="nodrag cursor-pointer">
                                        <Editor controlPromptEditorRerenderKey={id} nodeId={id} />
                                    </div>
                                </CollapseArea>
                            </Form>
                        );
                        }}
                    </Formik>
                </CollapseArea>
            </GradientBorder>

            <Handle
                type="target"
                position={Position.Left}
                id={`${props?.id}-target`}
                isConnectable={true}
                className="handle"
                style={{
                left: "3px",
                }}
            />

        </Fragment>
    );
}

export default React.memo(WF_AnswerNode);