import CommonStyles from "@/Components/CommonStyles";
import { Output } from "../type";
import { useRef } from "react";

export const options = [
    { value: "String", label: "String" },
    { value: "Number", label: "Number" },
    { value: "Object", label: "Object" },
    { value: "Array[String]", label: "Array[String]" },
    { value: "Array[Number]", label: "Array[Number]" },
    { value: "Array[Object]", label: "Array[Object]" },
];

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
    const onOutputNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            handleOnOutputKeyChange(outputKey, event.target.value);
        }, 1000);
    }

    const onOutputTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        output.type = event.target.value;
        handleOnDataChange();
    }

    return (
        <div className="flex items-center ml-4">
            <CommonStyles.Input className="w-72"
                initValue={outputKey ?? ""}
                placeholder="Enter variable name "
                required
                afterOnchange={onOutputNameChange}
            />

            <select className="ml-2"
                value={output?.type}
                onChange={onOutputTypeChange}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default OutputRow;