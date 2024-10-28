import CommonField from "@/Components/CommonFields";
import CommonStyles from "@/Components/CommonStyles";
import { useReactFlow } from "@xyflow/react";
import { FastField, Form, Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {v4 as uuid} from "uuid";

interface InputTextProps {
  data?: InputTextInitialValues;
  type: string;
  nodeId: string;
  setOpenDialog: (value: boolean) => void;
}

export interface InputTextInitialValues {
  input_name: string;
  input_label: string;
  max_length: number;
  is_required: boolean;
}

const InputText = ({ data, type, nodeId, setOpenDialog, }: InputTextProps) => {
  const { t } = useTranslation("node");
  const { updateNode, getNode } = useReactFlow();


  const initialValues = useMemo<InputTextInitialValues>(() => {
    return {
      input_name: data?.input_name || "",
      input_label: data?.input_label || "",
      max_length: data?.max_length || 48,
      is_required: data?.is_required || false,
    };
  }, [data]);

  const validationSchema = useMemo(() => {
    return Yup.object({
      input_name: Yup.string().required("Required"),
      max_length: Yup.number().required("Required").min(1),
    });
  }, []);

  const handleSubmit = (values: InputTextInitialValues) => {
    const currentNodeData = getNode(nodeId)?.data;
    const currentNodeInputs = (currentNodeData?.inputs as unknown[]) || [];
    if (!currentNodeData) return;

    if(!data) {
      updateNode(nodeId, {
        data: {
          ...currentNodeData,
          inputs: [
            ...currentNodeInputs,
            {
              ...values,
              type,
              id: uuid(),
            },
          ],
        },
      });
    } else {
      const newInputs = currentNodeInputs.map((elm: any) => {
        if (elm.input_name === data.input_name) {
          return {
            ...values,
            type,
            id: uuid(),
          };
        }
        return elm;
      });

      updateNode(nodeId, {
        data: {
          ...currentNodeData,
          inputs: newInputs,
        },
      });
    }

    setOpenDialog(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="flex flex-col ">
        <FastField
          name="input_name"
          component={CommonField.InputField}
          label={t("WF_Startnode.input_name")}
          placeholder={t("WF_Startnode.input_name")}
          fullWidth
          required
        />

        <FastField
          name="input_label"
          component={CommonField.InputField}
          label={t("WF_Startnode.input_label")}
          placeholder={t("WF_Startnode.input_label")}
          fullWidth
        />

        {type !== "number" && (
          <FastField
            name="max_length"
            component={CommonField.InputField}
            label={t("WF_Startnode.max_length")}
            fullWidth
            type="number"
            min={1}
          />
        )}

        <div className="flex gap-1 items-center mt-2">
          <FastField
            name="is_required"
            component={CommonField.CheckBoxField}
            label={t("WF_Startnode.is_required")}
          />
          <CommonStyles.Typography type="bold14">
            {t("WF_Startnode.is_required")}
          </CommonStyles.Typography>
        </div>

        <div className="w-full flex justify-end gap-2">
          <CommonStyles.Button variant="outlined" onClick={() => setOpenDialog(false)}>
            {t("WF_Startnode.cancel")}
          </CommonStyles.Button>
          <CommonStyles.Button variant="contained" type="submit">
            {t("WF_Startnode.save")}
          </CommonStyles.Button>
        </div>
      </Form>
    </Formik>
  );
};

export default InputText;
