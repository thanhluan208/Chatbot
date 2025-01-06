import CommonStyles from "@/Components/CommonStyles";
import { Output, VariablesType } from "../type";
import { useCallback, useMemo, useRef } from "react";

interface OutputRowProps {
    outputKey: string;
    output: Output;
    handleOnDataChange: () => void,
    handleOnOutputKeyChange: (key: string, newKey: string) => void,
}

const OutputRow = ({
    outputKey,
    output,
    handleOnDataChange,
    handleOnOutputKeyChange
}: OutputRowProps) => {

    const timeoutRef = useRef<number | null>(null);

    const varTypeOptions = useMemo(() => {
        return Object.entries(VariablesType).map(([key, value]) => {
          return {
            value: value,
            label: key,
          };
        });
      }, []);

    const onOutputNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            handleOnOutputKeyChange(outputKey, event.target.value);
        }, 1000);
    }

    const onOutputTypeChange = useCallback((value: string) => {
        if (value === output?.type) return;
        output.type = value;
        handleOnDataChange();
    },[output]);

    return (
        <div className="flex items-center ml-4">
            <CommonStyles.Input className="w-72"
                initValue={outputKey ?? ""}
                placeholder="Enter variable name "
                required
                afterOnchange={onOutputNameChange}
            />

            <CommonStyles.Select
                handleChange={onOutputTypeChange}
                value={output?.type}
                options={varTypeOptions}
                sx={{
                    marginLeft: "0.25rem",
                    width: "10rem"
                }}
            />

            {/* <select className="ml-2"
                value={output?.type}
                onChange={onOutputTypeChange}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select> */}
        </div>
    );
}

export default OutputRow;