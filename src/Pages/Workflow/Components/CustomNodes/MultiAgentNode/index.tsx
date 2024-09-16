import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Handle,
  MarkerType,
  NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { Box, Tooltip, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "../CollapseArea";
import { FastField, Formik } from "formik";
import CommonField from "@/Components/CommonFields";
import { useGet, useSave } from "@/Stores/useStore";
import DeleteAgentButton from "./DeleteAgentButton";
import logo from "@/assets/logo.png";
import { modelOptions } from "@/Constants/options";
import { BotData } from "@/Hooks/Bot/useGetBotData";
import EngineSelect from "@/Pages/ChatbotConfigure/components/EngineSelect";
import GenerationDiversity from "@/Pages/ChatbotConfigure/components/GenerationDiversity";
import Advance from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Advance";
import InputAndOutputSettings from "@/Pages/ChatbotConfigure/components/InputAndOutputSettings";

const MultiAgentNode = (props: NodeProps) => {
  //! State
  const shouldRemove = useGet(`${props.id}_remove` as any);
  const { setNodes, setEdges, updateNode, updateEdge } = useReactFlow();
  const [isAdding, setIsAdding] = React.useState(false);
  const placeholderId = useRef<string | null>(uuid());
  const save = useSave();
  const theme = useTheme();

  const botData = props?.data?.botData as BotData;

  const handleid = useMemo(() => {
    return {
      source: uuid(),
      target: uuid(),
    };
  }, []);

  const initialValue = useMemo(() => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === botData?.llm?.model;
    });
    return {
      scenario: "",
      system_prompt: "",
      model: foundModel ?? modelOptions[5],
      generationDiversity: "precise",
      temperature: botData?.llm?.temperature ?? 1.21,
      top_p: botData?.llm?.top_p ?? 0.9,
      history_turn: botData?.llm?.history_turn ?? 3,
      max_tokens: botData?.llm?.max_tokens ?? 2048,
    };
  }, []);
  //! Function
  const handleAddPlaceholder = () => {
    if (isAdding) return;
    setIsAdding(true);
    const newId = uuid();
    placeholderId.current = newId;
    const newNode = {
      id: newId,
      type: props.type,
      position: {
        x:
          props.positionAbsoluteX +
          (props?.width ?? 500) +
          Math.floor(Math.random() * 200 + 300),
        y: props.positionAbsoluteY + Math.floor(Math.random() * 1000 - 500),
      },
      data: {
        isPlaceholder: true,
      },
    };

    setNodes((nodes) => nodes.concat(newNode));
    setEdges((edges) =>
      edges.concat({
        id: `${props.id}-${newId}`,
        source: props.id,
        target: newId,
        animated: true,
        type: "animatedSvg",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#4e40e5",
        },
        data: {
          isPlaceholder: true,
        },
        deletable: true,
      })
    );
  };

  const handleRemovePlaceholder = () => {
    if (!placeholderId.current) return;
    save(`${placeholderId.current}_remove`, true);
    setIsAdding(false);
    setEdges((edges) => {
      const newEdges = edges.filter((edge) => {
        return !edge.data?.isPlaceholder;
      });

      console.log("newEdges", newEdges);
      return newEdges;
    });
  };

  const handleAddNode = () => {
    if (!placeholderId.current) return;
    updateNode(placeholderId.current, {
      data: {
        isPlaceholder: false,
      },
    });

    updateEdge(`${props.id}-${placeholderId.current}`, {
      data: {
        isPlaceholder: false,
      },
      animated: false,
    });

    placeholderId.current = null;
    setIsAdding(false);
  };

  const handleClickNode = useCallback(() => {
    setEdges((edges) => {
      const newEdges = edges.map((item) => {
        if (item.source === props.id || item.target === props.id) {
          return {
            ...item,
            animated: true,
          };
        } else {
          return {
            ...item,
            animated: false,
          };
        }
      });
      return newEdges;
    });
  }, [props?.id]);

  useEffect(() => {
    const node = document.getElementById(props.id);
    if (node && shouldRemove) {
      node.style.opacity = "0";
    }

    setTimeout(() => {
      if (node && shouldRemove) {
        setNodes((nodes) => nodes.filter((n) => n.id !== props.id));
      }
    }, 500);
  }, [shouldRemove, props.id]);

  useEffect(() => {
    if (props.selected) {
      setEdges((edges) => {
        return edges.map((edge) => {
          if (edge.source === props.id || edge.target === props.id) {
            return {
              ...edge,
              animated: true,
            };
          }
          return {
            ...edge,
            animated: false,
          };
        });
      });
    } else {
      setEdges((edge) =>
        edge.map((item) => ({
          ...item,
          animated: false,
        }))
      );
    }
  }, [props?.selected, props?.id]);

  //! Render
  return (
    <Box
      id={props.id}
      sx={{
        opacity: props.data?.isPlaceholder ? 0.5 : 1,
        borderRadius: "8px",
        background: theme.colors.custom.backgroundCard,
        border: props?.selected ? "solid 2px #4e40e5" : "solid 2px transparent",
        minWidth: "380px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
        padding: "12px",
        transition: "all 0.5s ease",
        "& .handle": {
          "&::before": {
            content: '"+"',
            color: theme.colors.custom.backgroundCard,
            fontWeight: "bold",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            opacity: 0,
            transition: "all 0.3s ease",
          },
          "&:hover": {
            "&::before": {
              opacity: 1,
            },
          },
        },
      }}
      onClick={handleClickNode}
    >
      <CollapseArea
        label={
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
              <img
                src={logo}
                alt="logo"
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                }}
              />
              <CommonStyles.Typography
                type="semiBold16"
                sx={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {`Agent ${props.id}`}
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

              <DeleteAgentButton id={props.id} />
            </Box>
          </Box>
        }
        sxContainer={{
          marginTop:'0',
          "& .collapse-header": {
            marginBottom:'0'
          }
        }}
      >
        <Formik initialValues={initialValue} onSubmit={() => {}}>
          {() => {
            return (
              <Fragment>
                <CollapseArea
                  label={
                    <CommonStyles.Typography type="semiBold14">
                      Model Configuration
                    </CommonStyles.Typography>
                  }
                  
                >
                  <EngineSelect />
                  <GenerationDiversity />
                  <Advance />
                  <InputAndOutputSettings />
                </CollapseArea>

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
      </CollapseArea>

      <Handle
        type="source"
        position={Position.Right}
        id={handleid.source}
        isConnectable={true}
        className="handle"
        onMouseEnter={handleAddPlaceholder}
        onMouseLeave={handleRemovePlaceholder}
        onClick={handleAddNode}
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
