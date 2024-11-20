import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { CodeNodeInput } from "../type";
import { CircleMinus, Plus } from "lucide-react";
import CommonStyles from "@/Components/CommonStyles";
import Hint from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Hint";
import InputRow from "./InputRow";
import { Box } from "@mui/material";

interface InputSectionProps{
    inputs: CodeNodeInput[],
    handleAddInput: () => void,
    handleDeleteInput: (index: number) => void,
    handleInputChange: (index: number, value: CodeNodeInput) => void
}

const InputSection = ({inputs, handleAddInput, handleDeleteInput, handleInputChange}: InputSectionProps) => {

    return (
        <div style={{background: "#2e2d380a", borderRadius: "8px", marginBottom: "12px"}}>
            <CollapseArea
            // nodeId={id}
            initOpen={true}
            label={
                <Box
                sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                }}
                >
                <CommonStyles.Typography type="semiBold14">
                    Input
                </CommonStyles.Typography>
                <Hint content="Enter the variable that needs to be added to the code, the code can directly reference the variable added here" />
                </Box>
            }
            >
                <div className="flex items-center ml-4"
                style={{fontSize: "12px", color: "#1c1d2359"}}>
                    <div className="w-40">Parameter name</div>
                    <div className="w-40 pl-2">Parameter value</div>
                </div>

                {inputs.map((input, index)=>(
                    <div className="flex items-center justify-between justify-items-center ml-4 mt-2">
                    <InputRow
                        input={input}
                        handleOnChange={handleInputChange}
                    />

                    <CircleMinus className="mr-1"
                        style={{color : "#1c1d2359", cursor: "pointer"}}
                        onClick={() => handleDeleteInput(index)}
                    />
                    </div>
                ))}

                <CommonStyles.Button
                    variant="contained"
                    sx={{
                        marginTop: "1rem",
                        marginLeft: "1rem",
                        marginBottom: "0.5rem",
                        width: "6rem",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        handleAddInput();
                    }}
                >
                    <Plus size={24} />
                    Add
                </CommonStyles.Button>
            </CollapseArea>
        </div>
    );
}

export default InputSection;