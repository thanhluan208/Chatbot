import CommonStyles from "@/Components/CommonStyles";
import { CodeNodeInput, ParamType } from "../type";
import { useMemo, useState } from "react";

const InputRow = (input: CodeNodeInput) => {
  const [paramType, setParamType] = useState<string>(input?.paramType);

  const paramOptions = useMemo(() => {
    return [
      { value: ParamType.REFERENCE, label: ParamType.REFERENCE },
      { value: ParamType.INPUT, label: ParamType.INPUT },
    ];
  }, []);

  const handleSelectChange = (
    value: string | React.ChangeEvent<{ value: unknown }>
  ) => {
    if (typeof value === "string") {
      setParamType(value);
    } else {
      setParamType(ParamType.REFERENCE);
    }
  };

  return (
    <div className="flex items-center ml-4">
      <CommonStyles.Input
        className="w-40"
        initValue={input?.paramName ?? ""}
        placeholder="Enter parameter name "
        required
      />

      <CommonStyles.Select
        className="ml-2 mr-1"
        options={paramOptions}
        value={paramType}
        handleChange={handleSelectChange}
      />

      {paramType === ParamType.INPUT.toString() ? (
        <CommonStyles.Input
          className="ml-2"
          placeholder="Enter the parameter value"
          required
        />
      ) : (
        <CommonStyles.Select
          className="ml-2"
          options={[
            { value: 1, label: "var1" },
            { value: 2, label: "var2" },
            { value: 3, label: "var3" },
          ]}
        />
      )}
    </div>
  );
};

export default InputRow;
