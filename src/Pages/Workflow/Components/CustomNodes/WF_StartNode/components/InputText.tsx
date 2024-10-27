import CommonField from "@/Components/CommonFields";
import CommonStyles from "@/Components/CommonStyles";
import { FastField, Form, Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

interface InputTextProps {
  data?: InputTextInitialValues;
  type: string;
}

export interface InputTextInitialValues {
  input_name: string;
  input_label: string;
  max_length: number;
  is_required: boolean;
}

const InputText = ({ data, type }: InputTextProps) => {
  const { t } = useTranslation("node");

  const initialValues = useMemo<InputTextInitialValues>(() => {
    return {
      input_name: data?.input_name || "",
      input_label: data?.input_label || "",
      max_length: data?.max_length || 48,
      is_required: data?.is_required || false,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object({
      input_name: Yup.string().required("Required"),
      input_label: Yup.number().required("Required").min(1),
    });
  }, []);

  const handleSubmit = (_: InputTextInitialValues) => {};

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
      </Form>
    </Formik>
  );
};

export default InputText;
