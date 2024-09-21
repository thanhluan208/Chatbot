import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Handle,
  MarkerType,
  NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "../../../../../Components/CommonStyles/CollapseArea";
import { FastField, Form, Formik } from "formik";
import CommonField from "@/Components/CommonFields";
import { useGet, useSave } from "@/Stores/useStore";
import DeleteAgentButton from "./DeleteAgentButton";
import logo from "@/assets/logo.png";
import { modelOptions } from "@/Constants/options";
import GenerationDiversity from "@/Pages/ChatbotConfigure/components/GenerationDiversity";
import Advance from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Advance";
import InputAndOutputSettings from "@/Pages/ChatbotConfigure/components/InputAndOutputSettings";
import EngineSelect from "../LLMNode/SingleTab/EngineSelect";
import reactFlowService from "@/Services/reactFlowService";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { toast } from "react-toastify";
import httpServices from "@/Services/httpServices";
import {
  updateNodeLLM,
  updateScenario,
  updateSystemPrompt,
} from "@/Constants/api";

import "./index.css";
import cachedKeys from "@/Constants/cachedKeys";

const MultiAgentNode = (props: NodeProps) => {
  //! State
  const { data } = props;
  const shouldRemove = useGet(`${props.id}_remove` as any);
  console.log("data", data);
  const {
    setNodes,
    setEdges,
    updateNode,
    updateEdge,
    getNodes,
    getNode,
    setCenter,
  } = useReactFlow();
  const [isAdding, setIsAdding] = React.useState(false);
  const [isRenaming, setIsRenaming] = React.useState(false);

  const placeholderId = useRef<string | null>(uuid());
  const nameRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<any>(null);

  const save = useSave();
  const theme = useTheme();

  const params = useParams();
  const botId = params?.botId;

  const { userId } = useAuth();

  const initialValue = useMemo(() => {
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

  const classname = useMemo(() => {
    if (data?.currentNode && data?.startNode) return "chatting-start";
    else if (data?.currentNode && !data?.startNode) return "agent-chatting";
    else if (data?.startNode) return "start-node";
    else return "agent-node";
  }, [data?.currentNode, data?.startNode]);

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
    if (!placeholderId.current || !userId) return;
    const newNode = getNode(placeholderId.current);

    if (!newNode) return;

    const onSuccess = (id: string) => {
      updateNode(newNode.id, {
        id: id,
        data: {
          label: `Agent ${id}`,
        },
      });
      updateEdge(`${props.id}-${newNode.id}`, {
        data: {
          isPlaceholder: false,
        },
        target: id,
        animated: false,
      });
    };

    const onFailed = () => {
      save(`${newNode.id}_remove`, false);
      setEdges((edges) =>
        edges.filter((edge) => edge.id !== `${props.id}-${newNode.id}`)
      );
      toast.error("Failed to create agent");
    };

    reactFlowService.createFlow(
      botId as string,
      userId,
      onSuccess,
      onFailed,
      JSON.stringify({
        id: newNode?.id,
        position: newNode?.position,
        measured: newNode?.measured,
        data: newNode?.data,
      }),
      props.id
    );

    placeholderId.current = null;
    setIsAdding(false);
  };

  const afterOnChangePrompt = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        httpServices
          .post(updateSystemPrompt, {
            bot_id: botId,
            node_id: props.id,
            system_prompt: event.target.value,
          })
          .catch((err) => {
            console.log("err", err);
            toast.error("Failed to update system prompt");
          });
      }, 500);
    },
    [botId, props.id]
  );

  const afterOnChangeScenario = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        httpServices
          .post(updateScenario, {
            bot_id: botId,
            node_id: props.id,
            scenario: event.target.value,
          })
          .catch((err) => {
            console.log("err", err);
            toast.error("Failed to update system prompt");
          });
      }, 500);
    },
    [botId, props.id]
  );

  const handleRename = useCallback(() => {
    if (!botId) return;
    const info = {
      position: {
        x: props.positionAbsoluteX,
        y: props.positionAbsoluteY,
      },
      data: {
        ...props.data,
        label: nameRef?.current?.value,
      },
    };

    reactFlowService
      .updateFlow(botId, props.id, JSON.stringify(info))
      .catch((err) => {
        console.log("err", err);
      });

    updateNode(props?.id, {
      data: {
        ...props.data,
        label: nameRef?.current?.value,
      },
    });
    setIsRenaming(false);
  }, [updateNode, props?.id, props?.data]);

  const handleSubmit = useCallback(async (values: any) => {
    const toastId = toast.loading(`Saving agent ${props.id}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.post(updateNodeLLM, {
        bot_id: botId,
        node_id: props.id,
        llm_name: values.model.value,
        model_params: {
          temperature: values.temperature ?? 1.21,
          top_p: values.top_p ?? 0.9,
          history_turn: values.history_turn ?? 3,
          max_tokens: values.max_tokens ?? 2048,
          frequency_penalty: values.frequency_penalty ?? 0,
          presence_penalty: values.presence_penalty ?? 0,
        },
      });

      if (response?.data?.status_code === 200) {
        toast.update(toastId, {
          isLoading: false,
          render: "Agent saved successfully!",
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          isLoading: false,
          render: "Failed to save agent!",
          type: toast.TYPE.ERROR,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log("error", error);
      toast.update(toastId, {
        isLoading: false,
        render: "Failed to save agent!",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
      });
    }
  }, []);

  const handleChatWithBot = useCallback(() => {
    save(cachedKeys.OPEN_CHAT, true);
    save(cachedKeys.COLLAPSE_TOOLBAR, true);
    setCenter(props.positionAbsoluteX + 1100, props.positionAbsoluteY + 550, {
      zoom: 0.55,
      duration: 1,
    });
    const currentNode = getNodes().find((node) => node.data?.currentNode);
    if (currentNode) {
      updateNode(currentNode.id, {
        data: {
          ...currentNode.data,
          currentNode: false,
        },
      });
    }

    updateNode(props?.id, {
      data: {
        ...props.data,
        currentNode: true,
      },
    });
  }, [setNodes, props?.id, updateNode, props?.data]);

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
        display: "flex",
        borderRadius: "8px",
        padding: "2px",
        transition: "all 0.5s ease",
        position: "relative",
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
    >
      {(!!data?.currentNode || !!data?.startNode) && (
        <Box
          sx={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {!!data?.currentNode && (
            <Box
              sx={{
                background: `${theme.palette.success.main}`,
                borderRadius: "12px",
                padding: "4px 12px",
              }}
            >
              <CommonStyles.Typography type="semiBold16" color="#fff">
                Chatting...
              </CommonStyles.Typography>
            </Box>
          )}
          {!!data?.startNode && (
            <Box
              sx={{
                background: `${theme.palette.secondary.main}`,
                borderRadius: "12px",
                padding: "4px 12px",
              }}
            >
              <CommonStyles.Typography type="semiBold16" color="#fff">
                Start node
              </CommonStyles.Typography>
            </Box>
          )}
        </Box>
      )}
      <Box
        sx={{
          borderRadius: "8px",
          position: "relative",
          padding: "2px",
          minWidth:
            props?.data?.currentNode && props?.selected ? "800px" : "500px",
          transition: "all 0.5s ease",
          overflow: "hidden",
          display: "flex",
          boxShadow:
            "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
          "&:hover": {
            boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
          },
        }}
        className={classname}
        onClick={() => {
          const updates: any = {
            selected: true,
            readyToPaste: true,
          };
          updateNode(props?.id, {
            ...props.data,
            ...updates,
          });
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            position: "relative",
            background: theme.colors.custom.backgroundCard,
            borderRadius: "8px",
          }}
        >
          <CollapseArea
            nodeId={props.id}
            dataKey="wrapperNode"
            initOpen={!!props?.data?.currentNode}
            key={props?.data?.currentNode as any}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
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
                  <Box
                    sx={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    {isRenaming ? (
                      <CommonStyles.Input
                        ref={nameRef}
                        initValue={props?.data?.label as string}
                        key={props?.data?.label as string}
                        sxContainer={{
                          "& .MuiInputBase-root": {
                            height: "23.56px",
                          },
                        }}
                      />
                    ) : (
                      <CommonStyles.Typography
                        type="semiBold16"
                        sx={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {(props?.data?.label as string) ?? `Agent ${props.id}`}
                      </CommonStyles.Typography>
                    )}
                    {isRenaming ? (
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
                        <CommonStyles.Button
                          isIcon
                          tooltip="Cancel"
                          isRound={false}
                          sx={{
                            svg: {
                              width: "16px",
                              height: "16px",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsRenaming(false);
                          }}
                        >
                          <CommonIcons.Close />
                        </CommonStyles.Button>
                        <CommonStyles.Button
                          isIcon
                          tooltip="Cancel"
                          isRound={false}
                          sx={{
                            svg: {
                              width: "16px",
                              height: "16px",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename();
                          }}
                        >
                          <CommonIcons.Save />
                        </CommonStyles.Button>
                      </Box>
                    ) : (
                      <CommonStyles.Button
                        isIcon
                        tooltip="Rename"
                        isRound={false}
                        sx={{
                          svg: {
                            width: "16px",
                            height: "16px",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(true);
                          setTimeout(() => {
                            nameRef.current?.focus();
                          }, 1);
                        }}
                      >
                        <CommonIcons.Edit />
                      </CommonStyles.Button>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <CommonStyles.Button
                    isIcon
                    tooltip={
                      data?.currentNode ? "Chatting..." : "Chat with this bot"
                    }
                    onClick={handleChatWithBot}
                  >
                    <CommonIcons.Chat
                      fill={theme.colors.custom.normalColorTypo as string}
                    />
                  </CommonStyles.Button>

                  <DeleteAgentButton id={props.id} />
                </Box>
              </Box>
            }
            sxContainer={{
              marginTop: "0",
              "& .collapse-header": {
                marginBottom: "0",
              },
            }}
          >
            <Formik initialValues={initialValue} onSubmit={handleSubmit}>
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <CollapseArea
                      nodeId={props.id}
                      dataKey="modelConfiguration"
                      initOpen={!!props?.data?.currentNode}
                      key={props?.data?.currentNode + props.id + "modelConfiguration"}
                      label={
                        <CommonStyles.Typography type="semiBold14">
                          Model Configuration
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
                      nodeId={props.id}
                      dataKey="scenario"
                      initOpen={!!props?.data?.currentNode}
                      key={props?.data?.currentNode + props.id + "scenario"}
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
                        afterOnChange={afterOnChangeScenario}
                      />
                    </CollapseArea>

                    <CollapseArea
                      nodeId={props.id}
                      dataKey="agentPrompt"
                      initOpen={
                        !!props?.data?.currentNode || !!props?.data?.agentPrompt
                      }
                      key={props?.data?.currentNode + props.id + "agentPrompt"}
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
                        afterOnChange={afterOnChangePrompt}
                      />
                    </CollapseArea>
                  </Form>
                );
              }}
            </Formik>
          </CollapseArea>
        </Box>
      </Box>
      <Handle
        type="source"
        position={Position.Right}
        id={`${props?.id}-source`}
        isConnectable={true}
        className="handle"
        onMouseEnter={handleAddPlaceholder}
        onMouseLeave={handleRemovePlaceholder}
        onClick={handleAddNode}
        style={{
          right: "3px",
        }}
      />
      {!data?.startNode && (
        <Handle
          type="target"
          position={Position.Left}
          id={`${props?.id}-target`}
          isConnectable={true}
          className="handle"
        />
      )}
    </Box>
  );
};

export default React.memo(MultiAgentNode);
