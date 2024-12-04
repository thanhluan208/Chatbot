import { useMemo, useRef } from "react";
import { Output } from "./type";
import { StartNodeInputType } from "@/Types/workflow";
import CustomizeSelectField from "@/Components/CommonFields/CustomizeSelectField";
import CommonStyles from "@/Components/CommonStyles";
import { useTheme } from "@mui/material";
import { CommonOption } from "@/Types/common";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import { cloneDeep } from "lodash";

interface OutputListProps {
  data: Output;
  handleUpdate: (payload: Output) => void;
  handleRemoveOutput: (id: string) => void;
}

const OutputItem = ({
  data,
  handleUpdate,
  handleRemoveOutput,
}: OutputListProps) => {
  const theme = useTheme();
  const debounceRef = useRef<number | null>(null);

  const typeOptions = useMemo(() => {
    return Object.values(StartNodeInputType).map((type) => ({
      value: type,
      label: type,
    }));
  }, []);

  const initValue = useMemo(() => {
    return typeOptions.find((option) => option.value === data.type);
  }, [typeOptions, data.type]);

  const handleChangeInput = (value: string | number, isName?: boolean) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const payload = cloneDeep(data);

      if (isName) {
        payload.name = String(value);
      } else {
        payload.desc = String(value);
      }

      handleUpdate(payload);
    }, 500);
  };

  const handleSelectType = (value: string) => {
    handleUpdate({
      ...data,
      type: value as StartNodeInputType,
    });
  };

  const customizeValue = (selectedOption: CommonOption) => {
    return (
      <div
        className="px-3 h-10 rounded-lg flex items-center gap-3"
        style={{
          border: `1px solid ${theme.colors.custom.borderColor}`,
          background: theme.colors.custom.backgroundCard,
        }}
      >
        <CommonStyles.Typography type="semiBold16">
          {selectedOption.label}
        </CommonStyles.Typography>
        <div>
          <ChevronUp size={8} />
          <ChevronDown size={8} />
        </div>
      </div>
    );
  };

  console.log(initValue)

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex items-end justify-between">
        <CommonStyles.Input
          initValue={data?.name}
          label="Output name"
          afterOnchange={(event) => handleChangeInput(event.target.value, true)}
        />

        <div className="flex gap-2 items-center">
          <CustomizeSelectField
            key={JSON.stringify(initValue)}
            options={typeOptions}
            initValue={initValue}
            customizeValue={customizeValue}
            afterOnChange={handleSelectType}
          />
          <CommonStyles.Button
            isIcon
            color="error"
            size="small"
            onClick={() => handleRemoveOutput(data.name)}
          >
            <Trash size={14} />
          </CommonStyles.Button>
        </div>
      </div>
      <CommonStyles.Input
        initValue={data.desc}
        placeholder="Enter description..."
        fullWidth
        multiline
        minRows={2}
        sx={{
          fieldset: {
            borderRadius: 0,
            border: "none",
          },
        }}
        afterOnchange={(event) => handleChangeInput(event.target.value, false)}
      />
    </div>
  );
};

export default OutputItem;
