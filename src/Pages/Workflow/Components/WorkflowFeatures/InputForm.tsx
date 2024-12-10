import CommonField from "@/Components/CommonFields";
import CommonStyles from "@/Components/CommonStyles";
import { runWorkflow } from "@/Constants/api";
import { LOCAL_STORAGE_KEY } from "@/Constants/common";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useReactFlow } from "@xyflow/react";
import { Field, Form, Formik } from "formik";
import { useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { NodeDataStart } from "../CustomNodes/WF_StartNode/type";
import { CircularProgress } from "@mui/material";
import { EventEnum, ResponseRunWorkflow } from "./type";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

interface InputFormProps {
  conversationId: string;
  setIsInputValid: (value: boolean) => void;
}
const REQUEST_TIMEOUT_MS = 5000;

const InputForm = ({ conversationId, setIsInputValid }: InputFormProps) => {
  const { userId } = useAuth();
  const { workflowId } = useParams<{ workflowId: string }>();
  const save = useSave();
  const { getNodes, updateNode, getNode } = useReactFlow();
  const nodes = getNodes();
  const controller = useRef<AbortController | null>(null);

  const startNodeData: NodeDataStart | undefined = useMemo(() => {
    const startNode = nodes.find(
      (node) => node.type === `customNode_WF_${NodeTypeWorkflow.START}`
    );

    if (startNode) {
      return startNode.data as unknown as NodeDataStart;
    }
  }, [nodes]);

  if (!startNodeData) return null;

  const formikProps = useMemo(() => {
    const initialValues: Record<string, string> = {};
    const validationSchema: Record<
      string,
      yup.StringSchema<string | undefined>
    > = {};

    startNodeData.variables?.forEach((variable) => {
      initialValues[variable.variable] = "";
      if (variable.required) {
        validationSchema[variable.variable] = yup
          .string()
          .required(`${variable.label} is required`);
      } else {
        validationSchema[variable.variable] = yup.string();
      }
    });
    return {
      initialValues,
      validationSchema: yup.object().shape(validationSchema),
    };
  }, [startNodeData.variables]);

  const abortFetch = useCallback((reason: string) => {
    console.log("aborting fetch: ", reason, controller);
    if (controller.current) controller.current.abort(reason);
  }, []);

  const handleSubmit = async (values: Record<string, string>) => {
    const requestTimeoutId = setTimeout(() => {
      abortFetch("Request timeout");
    }, REQUEST_TIMEOUT_MS);

    const runtimeWorkflow: ResponseRunWorkflow[] = [];
    setIsInputValid(false);
    save(cachedKeys.WORKFLOW_RUNTIME, []);

    try {
      controller.current = new AbortController();
      await fetchEventSource(runWorkflow, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            LOCAL_STORAGE_KEY.ACCESS_TOKEN
          )}`,
        },
        body: JSON.stringify({
          user_id: userId,
          workflow_id: workflowId,
          conversation_id: conversationId,
          user_inputs: values,
        }),
        signal: controller.current.signal,

        async onopen(response) {
          console.log("onopen", response);
          if (response.status !== 200) {
            abortFetch("Failed to connect to server");
          }
          clearTimeout(requestTimeoutId);
        },
        onmessage(msg: any) {
          try {
            if (msg.event === "done") {
              setIsInputValid(true);
              save(cachedKeys.WORKFLOW_RUNTIME, runtimeWorkflow);
              return;
            }
            const data = JSON.parse(
              msg.data.substring(2, msg.data.length - 5)
            ) as ResponseRunWorkflow;

            if (data.event === EventEnum.NODE_RUN_STARTED) {
              const nodeUpdate = getNode(data.node_id);

              if (nodeUpdate) {
                updateNode(data.node_id, {
                  data: {
                    ...nodeUpdate.data,
                    runningNode: true,
                  },
                });
              }
            }

            if (data.event === EventEnum.NODE_RUN_SUCCEEDED) {
              runtimeWorkflow.push(data);

              const nodeUpdate = getNode(data.node_id);
              if (nodeUpdate) {
                updateNode(data.node_id, {
                  data: {
                    ...nodeUpdate.data,
                    runningNode: false,
                  },
                });
              }
            }

            if (data.event === EventEnum.GRAPH_RUN_SUCCEEDED) {
              save(cachedKeys.WORKFLOW_RESULT, data);
            }
          } catch (error) {
            console.log(error);
          }
        },
        onclose() {
          abortFetch("Connection closed by server.");
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={formikProps.initialValues}
      validationSchema={formikProps.validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => {
        return (
          <Form className="flex flex-col gap-3 mt-5">
            {startNodeData?.variables?.map((variable) => {
              return (
                <Field
                  component={CommonField.InputField}
                  label={variable.label}
                  placeholder={variable.description}
                  name={variable.variable}
                  required={variable.required}
                  key={variable.variable}
                  type={variable.type === "number" ? "number" : "text"}
                  fullWidth
                />
              );
            })}

            <div className="w-full flex justify-end">
              <CommonStyles.Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={16} /> : "Submit"}
              </CommonStyles.Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default InputForm;
