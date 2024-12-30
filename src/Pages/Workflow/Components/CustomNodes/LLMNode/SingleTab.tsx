import { Fragment, memo, useMemo } from "react";
import EngineSelect from "./SingleTab/EngineSelect";
import { FastField, Formik } from "formik";
import Inputs from "./SingleTab/Inputs";
import { v4 as uuid } from "uuid";
import CollapseArea from "../../../../../Components/CommonStyles/CollapseArea";
import CommonField from "../../../../../Components/CommonFields";
import Outputs from "./SingleTab/Outputs";

export interface LLMSingleTabInitialValue {
  llm: Llm;
  inputs: Put[];
  promps: string;
  outputs: Put[];
}

export interface Put {
  id: string;
  variableName: string;
  variableType: string;
  description: string;
}

export interface Llm {
  label: string;
  avatar: string;
  value: string;
  tag: string;
}

const SingleTab = () => {
  //! State
  const initialValues = useMemo<LLMSingleTabInitialValue>(() => {
    return {
      llm: {
        label: "GPT-4",
        avatar:
          "https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/MODEL_ICON/GPT-4.png",
        group: "OpenAI",
        value: "gpt-4",
        tag: "4k",
      },
      inputs: [
        {
          id: uuid(),
          variableName: "",
          variableType: "",
          description: "",
        },
      ],
      promps: "",
      outputs: [
        {
          id: uuid(),
          variableName: "",
          variableType: "",
          description: "",
        },
      ],
    };
  }, []);

  //! Function

  //! Render
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {() => {
        return (
          <Fragment>
            <EngineSelect />
            <Inputs />
            <CollapseArea label="Prompts">
              <FastField
                name="promps"
                component={CommonField.InputField}
                fullWidth
                multiline
                minRows={4}
                placeholder="User prompt. You can use [[variable name]], [[variable name, subvariable name]], or [[variable name[array index]]] to reference variables  in input parameters"
              />
            </CollapseArea>
            <Outputs />
          </Fragment>
        );
      }}
    </Formik>
  );
};

export default memo(SingleTab);
