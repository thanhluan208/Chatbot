import React, { Fragment } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import GradientBorder from "../../GradientBorder";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Form, Formik } from "formik";
import { Box, useTheme } from "@mui/material";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { MessageSquareQuote } from "lucide-react";
import CommonStyles from "@/Components/CommonStyles";
import { useTranslation } from "react-i18next";

const WF_LtmNode = (props: NodeProps) => {
    //! State
    const {data, id, positionAbsoluteX, positionAbsoluteY} = props;
    const theme = useTheme();
    const {t} = useTranslation("node");

    //!Render
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
                                {/* description */}

                                <CollapseArea
                                    nodeId="{id}"
                                    label={
                                        <CommonStyles.Typography type="semiBold14">
                                            Memory
                                        </CommonStyles.Typography>
                                    }
                                >
                                </CollapseArea>

                                <CollapseArea
                                    nodeId="{id}"
                                    label={
                                        <CommonStyles.Typography type="semiBold14">
                                            Output
                                        </CommonStyles.Typography>


                                    }>

                                    <span>output</span>
                                    <div className="shrink-0 flex items-center py-0.5 px-2 rounded-[6px] ml-2 coz-mg-primary">
                                        <span className="text-xs coz-fg-primary">
                                            String
                                        </span>
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
};

export default React.memo(WF_LtmNode);