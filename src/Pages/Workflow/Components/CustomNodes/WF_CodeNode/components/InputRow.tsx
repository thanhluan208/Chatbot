import CommonStyles from "@/Components/CommonStyles";
import { CodeNodeInput, ParamType } from "../type";
import { useMemo, useState } from "react";
import { validate } from "uuid";

export const ParameterTypeOptions = [
    {value : ParamType.INPUT, label : ParamType.INPUT},
    {value : ParamType.REFERENCE, label : ParamType.REFERENCE},
]

const InputRow = (input: CodeNodeInput) => {
  const [paramName, setParamName] = useState<string>(input?.paramName || "");
  const [paramType, setParamType] = useState<string>(input?.paramType);

  const handleSelectChange = (value: string) => {
      setParamType(value);
  };

  return (
    <div className="flex items-center ml-4 mt-2">
      <CommonStyles.Input
        className="w-40"
        initValue={paramName}
        placeholder="Enter parameter name "
        afterOnchange={(e) => {setParamName(e.target.value)}}
        required
      />

        <select className="ml-2 mr-1"
        value={paramType}
        onChange={(e) => handleSelectChange(e.target.value)}>
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
        />
      ) : (
        <select className="ml-2 block w-full">
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
