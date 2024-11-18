import CommonStyles from "@/Components/CommonStyles";
import { CodeNodeOutput } from "../type";

export const options = [
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    },
    {
        value : ,
        label : 
    }
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