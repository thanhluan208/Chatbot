import CommonStyles from "@/Components/CommonStyles";
import { Variable } from "../type";
import { useMemo, useRef, useState } from "react";
import { validate } from "uuid";

// export const ParameterTypeOptions = [
//     {value : ParamType.INPUT, label : ParamType.INPUT},
//     {value : ParamType.REFERENCE, label : ParamType.REFERENCE},
// ]

interface InputRowProps{
  input: Variable,
  handleOnDataChange: (index: number, value: Variable) => void,
  index: number
}

const InputRow = ({input, handleOnDataChange, index}: InputRowProps) => {
  const timeoutRef = useRef<number | null>(null);

  // const handleSelectChange = (value: string) => {
  // };

  const onInputNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    input.variable = event.target.value;

    timeoutRef.current = window.setTimeout(() => {
      handleOnDataChange(index, input);
    }, 1000);
  }

  const onValueSelectorChange = () => {
    handleOnDataChange(index, input);
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
        <select className="ml-2 block w-full"
        onChange={onValueSelectorChange}>

        </select>
      {/* )} */}
    </div>
  );
};

export default InputRow;
