import React, { Fragment, useEffect, useMemo } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Box, Tooltip } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "../CollapseArea";
import { FastField, Formik } from "formik";
import CommonField from "@/Components/CommonFields";
import { useGet } from "@/Stores/useStore";
import { toast } from "react-toastify";

const MultiAgentNode = (props: NodeProps) => {
  //! State
  const shouldRemove = useGet(`${props.id}_remove` as any);
  const { setNodes } = useReactFlow();

  const handleid = useMemo(() => {
    return {
      source: uuid(),
      target: uuid(),
    };
  }, []);
  const id = useMemo(() => {
    return Math.random().toString(36).substring(7);
  }, []);

  const initialValue = useMemo(() => {
    return {
      scenario: "",
      system_prompt: "",
      llm: {
        model: "",
        temperature: 0,
      },
    };
  }, []);
  //! Function
  useEffect(() => {
    const node = document.getElementById(props.id);
    if (node && shouldRemove) {
      toast.error("Create new agent failed");
      node.style.opacity = "0";
    }

    setTimeout(() => {
      if (node && shouldRemove) {
        setNodes((nodes) => nodes.filter((n) => n.id !== props.id));
      }
    }, 500);
  }, [shouldRemove, props.id]);

  //! Render
  return (
    <Box
      id={props.id}
      sx={{
        borderRadius: "8px",
        background: "#fff",
        border: "solid 2px transparent",
        minWidth: "380px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
        padding: "12px",
        transition: "all 0.5s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <CommonIcons.Logo />
          <CommonStyles.Typography type="semiBold16">
            {`Agent ${id}`}
          </CommonStyles.Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Tooltip title="Chat with this agent" placement="top" arrow>
            <div>
              <CommonIcons.Chat />
            </div>
          </Tooltip>

          <CommonIcons.MoreHoriz />
        </Box>
      </Box>

      <Formik initialValues={initialValue} onSubmit={() => {}}>
        {() => {
          return (
            <Fragment>
              <CollapseArea
                label={
                  <CommonStyles.Typography type="semiBold14">
                    Scenario{" "}
                    <span
                      style={{
                        color: "#FF0000",
                      }}
                    >
                      *
                    </span>
                  </CommonStyles.Typography>
                }
              >
                <FastField
                  name="scenario"
                  component={CommonField.InputField}
                  multiline
                  minRows={3}
                  maxRows={3}
                  fullWidth
                  maxChar={6000}
                />
              </CollapseArea>

              <CollapseArea
                label={
                  <CommonStyles.Typography type="semiBold14">
                    Agent prompt
                    <span
                      style={{
                        color: "#FF0000",
                      }}
                    >
                      *
                    </span>
                  </CommonStyles.Typography>
                }
              >
                <FastField
                  name="system_prompt"
                  component={CommonField.InputField}
                  multiline
                  minRows={3}
                  maxRows={3}
                  fullWidth
                  maxChar={6000}
                />
              </CollapseArea>
            </Fragment>
          );
        }}
      </Formik>
      <Handle
        type="source"
        position={Position.Right}
        id={handleid.source}
        isConnectable={true}
        className="handle"
      />
      <Handle
        type="target"
        position={Position.Left}
        id={handleid.target}
        isConnectable={true}
        className="handle"
      />
    </Box>
  );
};

export default React.memo(MultiAgentNode);
