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
import CollapseArea from "../CollapseArea";
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
  updateMetadata,
  updateScenario,
  updateSystemPrompt,
} from "@/Constants/api";

const MultiAgentNode = (props: NodeProps) => {
  //! State
  const { data } = props;
  const shouldRemove = useGet(`${props.id}_remove` as any);
  const { setNodes, setEdges, updateNode, updateEdge, getNode } =
    useReactFlow();
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
    };
  }, [data]);
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

  const handleClickNode = useCallback(() => {
    updateNode(props?.id, {
      selected: true,
    });
  }, [props?.id]);

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
        label: nameRef?.current?.value,
      },
    });
    setIsRenaming(false);
  }, [updateNode, props?.id]);

  const handleSubmit = useCallback(async (values: any) => {
    const toastId = toast.loading(`Saving agent ${props.id}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.post(updateMetadata, {
        bot_id: botId,
        node_id: props.id,
        data: {
          llm: {
            model: values.model.value,
            temperature: values.temperature ?? 1.21,
            top_p: values.top_p ?? 0.9,
            history_turn: values.history_turn ?? 3,
            max_tokens: values.max_tokens ?? 2048,
          },
          scenario: values.scenario ?? "",
          system_prompt: values.system_prompt ?? "",
        },
        info: JSON.stringify({
          id: props?.id,
          position: {
            x: props.positionAbsoluteX,
            y: props.positionAbsoluteY,
          },
          data: props?.data,
        }),
      });
      console.log("response", response);

      toast.update(toastId, {
        isLoading: false,
        render: "Agent saved successfully!",
        type: toast.TYPE.SUCCESS,
        autoClose: 2000,
      });
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

      updateNode(props?.id, {
        data: {
          ...props.data,
          readyToPaste: true,
        },
      });
    } else {
      setEdges((edge) =>
        edge.map((item) => ({
          ...item,
          animated: false,
        }))
      );

      updateNode(props?.id, {
        data: {
          ...props.data,
          readyToPaste: false,
        },
      });
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
        border: data?.currentNode
          ? `solid 2px ${theme.palette.success.main}`
          : props?.selected
          ? "solid 2px #4e40e5"
          : "solid 2px transparent",
        minWidth: "380px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
        padding: "12px",
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
      onClick={handleClickNode}
    >
      {!!data?.currentNode && (
        <Box
          sx={{
            background: `${theme.palette.success.main}`,
            position:'absolute',
            top:'-50px',
            left:'50%',
            transform:'translateX(-50%)',
            padding:'4px 12px',
            borderRadius:'12px'
          }}
        >
          <CommonStyles.Typography type="semiBold16" color="#fff">
            Chatting with this agent...
          </CommonStyles.Typography>
        </Box>
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
                      onClick={() => setIsRenaming(false)}
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
                      onClick={handleRename}
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
                    onClick={() => {
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
                disabled={!!data?.currentNode}
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
                  initOpen={false}
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
                    afterOnChange={afterOnChangeScenario}
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
                    afterOnChange={afterOnChangePrompt}
                  />
                </CollapseArea>

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
              </Form>
            );
          }}
        </Formik>
      </CollapseArea>

      <Handle
        type="source"
        position={Position.Right}
        id={`${props?.id}-source`}
        isConnectable={true}
        className="handle"
        onMouseEnter={handleAddPlaceholder}
        onMouseLeave={handleRemovePlaceholder}
        onClick={handleAddNode}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${props?.id}-target`}
        isConnectable={true}
        className="handle"
      />
    </Box>
  );
};

export default React.memo(MultiAgentNode);
