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

const OutputRow = (input: CodeNodeOutput) => {
    return (
        <div className="flex items-center ml-4">
            <CommonStyles.Input className="w-40"
                initValue={input?.varName ?? ""}
                placeholder="Enter variable name "
                required
            />

            <CommonStyles.Select className="ml-2"
                options={options}
                value={input?.varDataType}
            />
        </div>
    );
}

export default OutputRow;