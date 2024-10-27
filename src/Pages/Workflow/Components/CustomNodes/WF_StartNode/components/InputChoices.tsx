import { FastField, FieldArray, Form, Formik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import CommonField from "@/Components/CommonFields";
import CommonStyles from "@/Components/CommonStyles";
import { Minus } from "lucide-react";

interface InputChoicesProps {
  data?: InputChoicesInitialValues;
  type: string;
}

export interface InputChoicesInitialValues {
  input_name: string;
  input_label: string;
  input_options: string[];
}

const InputChoices = ({ data }: InputChoicesProps) => {
  const { t } = useTranslation("node");

  const initialValues = useMemo<InputChoicesInitialValues>(() => {
    return {
      input_name: data?.input_name || "",
      input_label: data?.input_label || "",
      input_options: data?.input_options || [""],
    };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object({
      input_name: Yup.string().required("Required"),
      input_label: Yup.number().required("Required").min(1),
    });
  }, []);

  const handleSubmit = (_: InputChoicesInitialValues) => {};

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => {
        return (
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

            <div className="flex flex-col gap-1 items-center mt-2 w-full">
              <CommonStyles.Typography type="bold14" className="w-full">
                {t("WF_Startnode.options")}
              </CommonStyles.Typography>
              <FieldArray
                name="input_options"
                render={(helper) => {
                  return (
                    <div className="flex flex-col gap-1 w-full">
                      {values.input_options.map((_: string, index: number) => {
                        return (
                          <div className="flex gap-2">
                            <FastField
                              key={index}
                              name={`input_options.${index}`}
                              placeholder={t("WF_Startnode.options")}
                              component={CommonField.InputField}
                              fullWidth
                            />
                            {values.input_options.length > 1 && (
                              <CommonStyles.Button
                                isIcon
                                color="error"
                                hasBorder={false}
                                onClick={() => {
                                  helper.remove(index);
                                }}
                              >
                                <Minus />
                              </CommonStyles.Button>
                            )}
                          </div>
                        );
                      })}

                      <CommonStyles.Button
                        onClick={() => {
                          helper.push("");
                        }}
                      >
                        {t("WF_Startnode.add_option")}
                      </CommonStyles.Button>
                    </div>
                  );
                }}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default InputChoices;
