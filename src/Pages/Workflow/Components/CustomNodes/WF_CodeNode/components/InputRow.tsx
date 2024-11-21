import CommonStyles from "@/Components/CommonStyles";
import { CodeNodeInput, ParamType } from "../type";
import { useMemo, useState } from "react";
import { validate } from "uuid";

export const ParameterTypeOptions = [
    {value : ParamType.INPUT, label : ParamType.INPUT},
    {value : ParamType.REFERENCE, label : ParamType.REFERENCE},
]

interface InputRowProps{
  input: CodeNodeInput,
  handleOnChange: (index: number, value: CodeNodeInput) => void,
  index: number
}

const InputRow = ({input, handleOnChange, index}: InputRowProps) => {
  const [paramName, setParamName] = useState<string | any>(input?.paramName || "");
  const [paramType, setParamType] = useState<string>(input?.paramType);
  const [paramValue, setParamValue] = useState<String | any>(input?.value);

  const handleSelectChange = (value: string) => {
      setParamType(value);
  };

  const handleDataChange = () => {
    console.log("handleDataChange")
    const value : CodeNodeInput ={
      paramName : paramName,
      paramType : paramType, 
      value : paramValue
    };
    handleOnChange(index, value);
  }

  return (
    <div className="flex items-center">
      <CommonStyles.Input
        className="w-40"
        initValue={paramName}
        placeholder="Enter parameter name "
        onValueChange={(e) => 
          {setParamName(e);
          handleDataChange();
        }}
        onBlur={(e) => 
          {setParamName(e.target.value);
          handleDataChange()
        }}
        required
      />

        <select className="ml-2 mr-1"
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
        </select>

      {paramType === ParamType.INPUT.toString() ? (
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
      ) : (
        <select className="ml-2 block w-full"
        onChange={(e) =>{
          setParamValue(e.target.value);
          handleDataChange();
        }}>
            <option value="v1">
                var1
            </option>
            <option value="v2">
                var2
            </option>
        </select>
      )}
    </div>
  );
};

export default InputRow;
