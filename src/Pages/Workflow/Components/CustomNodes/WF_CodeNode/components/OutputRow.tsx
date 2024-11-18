import CommonStyles from "@/Components/CommonStyles";
import { CodeNodeOutput } from "../type";

export const options = [
    {value : "String", label : "String"},
    {value : "Boolean", label : "Boolean"},
    {value : "Number", label : "Number"},
    {value : "Object", label : "Object"},
    {value : "Array<String>", label : "Array<String>"},
    {value : "Array<Boolean>", label : "Array<Boolean>"},
    {value : "Array<Number>", label : "Array<Number>"},
    {value : "Array<Object>", label : "Array<Object>"},
];

interface OutputRowProps {
    output: CodeNodeOutput;
    index: number;
    onDataTypeChange: (value: string, index: number) => void;
  }

const OutputRow : React.FC<OutputRowProps> = ({ output,index, onDataTypeChange }) => {
    return (
        <div className="flex items-center ml-4">
            <CommonStyles.Input className="w-72"
                initValue={output?.varName ?? ""}
                placeholder="Enter variable name "
                required
            />

            <select className="ml-2"
                value={output?.varDataType}
                onChange={(e) => onDataTypeChange && onDataTypeChange(e.target.value, index)}
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