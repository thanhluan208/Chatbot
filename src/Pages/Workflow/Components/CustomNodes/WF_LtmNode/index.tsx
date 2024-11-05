import React, { Fragment, useMemo } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import GradientBorder from "../../GradientBorder";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Form, Formik } from "formik";
import { Box, useTheme } from "@mui/material";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { MessageSquareQuote } from "lucide-react";
import CommonStyles from "@/Components/CommonStyles";
import { useTranslation } from "react-i18next";
import Hint from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Hint";
import WindowSizeControl from "./components/WindowSizeControl";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { toast } from "react-toastify";

const WF_LtmNode = (props: NodeProps) => {
    //! State
    const { data, id, positionAbsoluteX, positionAbsoluteY} = props;
    const theme = useTheme();
    const { userId } = useAuth();
    const { workflowId } = useParams();
    const { updateNode } = useReactFlow();

    const { handleUpdateNodeData } = useWorkflowMutate();
    
    const {t} = useTranslation("node");

    const leftHandleId = useMemo(() => {
        return uuid();
      }, []);

    const rightHandleId = useMemo(() => {
        return uuid();
      }, []);


    const handleRename = async (name: string) => {
        const payload = {
            user_id: userId,
            workflow_id: workflowId,
            node_id: props.id,
            node_data: {
                name: name,
                desc: "",
                position: JSON.stringify({
                    x: props.positionAbsoluteX,
                    y: props.positionAbsoluteY,
                })
            },
        };  

        doRequest(payload);
    }

    const handleUpdateHistoryTurn = async (history_turn: number) => {
        const payload = {
            user_id: userId,
            workflow_id: workflowId,
            node_id: props.id,
            node_data: {
                desc: "",
                position: JSON.stringify({
                    x: props.positionAbsoluteX,
                    y: props.positionAbsoluteY,
                }),
                history_turn: history_turn
                },
        };

        doRequest(payload);
    };
    
    const doRequest = async(payload: any) =>{
        const response = await handleUpdateNodeData.mutateAsync(payload);
        if (response?.status_code === 200) {
            updateNode(props.id, {
            data: {
                ...props?.data,
                label: name,
            },
            });
        } else {
            toast.error(response?.message);
        }
    }


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
                                handleUpdateName={handleRename}
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
                                        <Box
                                            sx={{
                                            display: "flex",
                                            gap: "8px",
                                            alignItems: "center"
                                            }}
                                        >
                                            <CommonStyles.Typography type="semiBold14">
                                                Memory
                                            </CommonStyles.Typography>
                                            <Hint content="Chat memory settings" />
                                        </Box>
                                    }
                                >
                                    <WindowSizeControl 
                                        min={0} 
                                        max={100}
                                        handleUpdate={handleUpdateHistoryTurn}
                                    >
                                    </WindowSizeControl>
                                </CollapseArea>

                                <CollapseArea
                                    nodeId="{id}"
                                    label={
                                        <Box
                                            sx={{
                                            display: "flex",
                                            gap: "8px",
                                            alignItems: "center"
                                            }}
                                        >
                                            <CommonStyles.Typography type="semiBold14">
                                                Output
                                            </CommonStyles.Typography>
                                            <Hint content="The output list is the information that best match the input parameters, called from Long-term Memory of related Bot." />
                                        </Box>
                                    }>
                                    <div 
                                    className="flex ml-12 items-center" 
                                    style={{fontFamily: "SegoeUI"}}
                                    >
                                        <span>output</span>

                                        <div 
                                        className="shrink-0 flex items-center py-0.5 px-2 rounded-[6px] ml-2" 
                                        style={{backgroundColor: "rgba(6,7,9,0.04)"}}>
                                            <span className="text-xs">
                                                String
                                            </span>
                                        </div>
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
                id={leftHandleId}
                isConnectable={true}
                className="handle"
                style={{
                left: "3px",
                }}
            />

            <Handle
                type="target"
                position={Position.Right}
                id={rightHandleId}
                isConnectable={true}
                className="handle"
                style={{
                right: "3px",
                }}
            />

        </Fragment>
    );
};

export default React.memo(WF_LtmNode);