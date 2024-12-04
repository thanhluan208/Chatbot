import CommonStyles from "@/Components/CommonStyles";
import { Variable } from "../type";
import { useCallback, useMemo, useRef, useState } from "react";
import { validate } from "uuid";
import { NodeOutPutVar } from "@/Components/CommonStyles/EditorPlugin/type";

// export const ParameterTypeOptions = [
//     {value : ParamType.INPUT, label : ParamType.INPUT},
//     {value : ParamType.REFERENCE, label : ParamType.REFERENCE},
// ]

interface InputRowProps {
  input: Variable,
  handleOnDataChange: () => void,
  index: number,
  varListSelector: NodeOutPutVar[]
}

const InputRow = ({ input, handleOnDataChange, varListSelector, index }: InputRowProps) => {
  const timeoutRef = useRef<number | null>(null);

  // const handleSelectChange = (value: string) => {
  // };

  const opts: any[] = [];

  varListSelector.map((value) => {
    value.vars.map((variable, index) => {
      if (index === 0) {
        opts.push({ value: `${value.title}.${variable.variable}`, label: variable.variable, group: value.title });
      } else {
        opts.push({ value: `${value.title}.${variable.variable}`, label: variable.variable });
      }
    });
  });

  const onInputNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    input.variable = event.target.value;

    timeoutRef.current = window.setTimeout(() => {
      handleOnDataChange();
    }, 1000);
  }

  function onValueSelectorChange(value: string) {
    if (value === input?.value_selector.join(".")) return;
    input.value_selector = value.split(".");
    handleOnDataChange();
  }

  return (
    <div className="flex items-center">
      <CommonStyles.Input
        className="w-40"
        initValue={input.variable}
        placeholder="Enter parameter name "
        required
        afterOnchange={onInputNameChange}
      />

      {/* <select className="ml-2 mr-1"
        value={paramType}
        onChange={(e) => {
          handleSelectChange(e.target.value);
          handleDataChange()
          }}>
            {ParameterTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
            ))}
        </select> */}

      {/* {paramType === ParamType.INPUT.toString() ? (
        <CommonStyles.Input
          className="ml-2"
          placeholder="Enter the parameter value"
          required
          onValueChange={(e) => 
          {setParamValue(e);
            handleDataChange();}}
          onBlur={(e) => 
            {setParamValue(e.target.value);
            handleDataChange()
            }}
        />
      ) : ( */}

      <CommonStyles.Select
        handleChange={onValueSelectorChange}
        value={input.value_selector.join(".")}
        options={opts}
        sx={{
          marginLeft: "0.25rem",
          width: "15rem"
        }}
      />
      {/* )} */}
    </div>
  );
};

export default InputRow;
