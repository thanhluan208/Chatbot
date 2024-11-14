import CommonField from "@/Components/CommonFields";
import CommonStyles from "@/Components/CommonStyles";
import queryKey from "@/Constants/queryKey";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { StartNodeInputType, Variable } from "@/Types/workflow";
import { DialogActions, DialogContent } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { FastField, Form, Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface NodeFormProps {
  data?: Variable;
  nodeId: string;
  toggle: () => void;
}

const NodeForm = ({ data, nodeId, toggle }: NodeFormProps) => {
  const { t } = useTranslation("node");
  const { handleUpdateNodeData } = useWorkflowMutate();
  const { getNode, updateNode } = useReactFlow();
  const { userId } = useAuth();
  const { workflowId } = useParams();
  const queryClient = useQueryClient();

  const initialValues = useMemo(() => {
    return {
      variable: data?.variable || "",
      label: data?.label || "",
      description: data?.description || "",
      type: data?.type || StartNodeInputType.TEXT_INPUT,
      required: data?.required || false,
      max_length: data?.max_length || 256,
      options: data?.options || "",
      detault: data?.detault || "",
      hint: data?.hint || "",
    };
  }, [data]);

  const variableTypeOptions = Object.values(StartNodeInputType).map((value) => {
    return {
      value,
      label: value,
    };
  });

  const handleSubmit = async (values: Variable) => {
    if (!userId || !nodeId || !workflowId) return;
    const toastId = toast.info(t("WF_Startnode.processing"), {
      isLoading: true,
      autoClose: false,
    });

    const curNode = getNode(nodeId);

    const nextVariables = (curNode?.data?.variables as Variable[]).map(
      (elm) => {
        if (elm.variable === data?.variable) {
          return {
            ...elm,
            ...values,
          };
        }
        return elm;
      }
    );

    if (!data) {
      nextVariables.push(values);
    }

    const payload = {
      user_id: userId,
      workflow_id: workflowId,
      node_id: nodeId,
      node_data: {
        name: nodeId,
        desc: "",
        position: JSON.stringify(curNode?.position),
        variables: nextVariables,
      },
    };

    const response = await handleUpdateNodeData.mutateAsync(payload);
    if (response?.status_code === 200) {
      toast.update(toastId, {
        render: t("WF_Startnode.processed"),
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      updateNode(nodeId, {
        data: {
          ...curNode?.data,
          variables: nextVariables,
        },
      });

      queryClient.invalidateQueries({
        queryKey: [queryKey.WORKFLOW_VAR_SELECTOR],
      });
    } else {
      toast.update(toastId, {
        render: response?.message || t("WF_Startnode.failed"),
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }

    toggle && toggle();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ setFieldValue }) => {
        return (
          <Form>
            <DialogContent className="flex flex-col gap-3 !p-[0_28px_20px_28px]">
              <div className="flex items-center gap-2">
                <FastField
                  name="required"
                  component={CommonField.CheckBoxField}
                />
                <CommonStyles.Typography type="semiBold16">
                  {t("WF_Startnode.is_required")}
                </CommonStyles.Typography>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FastField
                  name="variable"
                  fullWidth
                  component={CommonField.InputField}
                  label={t("WF_Startnode.variable_name")}
                  placeholder={t("WF_Startnode.variable_name")}
                  maxChar={50}
                  afterOnChange={(
                    event: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    setFieldValue("label", event.target.value);
                  }}
                />
                <FastField
                  name={`type`}
                  component={CommonField.MuiSelectField}
                  label={t("WF_Startnode.type")}
                  placeholder={t("WF_Startnode.type")}
                  options={variableTypeOptions}
                  fullWidth
                />
              </div>
              <FastField
                name="description"
                component={CommonField.InputField}
                fullWidth
                label={t("WF_Startnode.description")}
                placeholder={t("WF_Startnode.description")}
                multiline
                minRows={3}
                maxChar={500}
              />

              <FastField
                name="hint"
                component={CommonField.InputField}
                fullWidth
                label={t("WF_Startnode.hint")}
                placeholder={t("WF_Startnode.hint")}
                multiline
                minRows={2}
                maxChar={250}
              />
            </DialogContent>
            <DialogActions className="mt-2">
              <CommonStyles.Button>
                {t("WF_Startnode.cancel")}
              </CommonStyles.Button>
              <CommonStyles.Button
                type="submit"
                color="primary"
                variant="contained"
              >
                {t("WF_Startnode.save")}
              </CommonStyles.Button>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NodeForm;
