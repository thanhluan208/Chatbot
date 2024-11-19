import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import Hint from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Hint";
import { Box } from "@mui/material";
import { CircleMinus, Plus } from "lucide-react";
import OutputRow from "./OutputRow";
import { CodeNodeOutput } from "../type";

interface OutputSectionProps{
    outputs: CodeNodeOutput[]
}

const OutputSection = ({outputs}: OutputSectionProps) => {

    return (
        <div style={{background: "#2e2d380a", borderRadius: "8px"}}>
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
                    Output
                </CommonStyles.Typography>
                <Hint content="The variables output after the code runs must ensure that the variable names and variable types defined here are completely consistent with those in the code's return" />
                </Box>
            }
            >
                <div className="flex items-center ml-4"
                style={{fontSize: "12px", color: "#1c1d2359"}}>
                    <div style={{flex: "1 1"}}>Variable name</div>
                    <div className="w-40">Variable type</div>
                </div>

                {outputs.map((output, index)=>(
                    <div className="flex items-center justify-between justify-items-center ml-2 mt-2">
                    <OutputRow
                        output={output}
                        index ={index}
                        // onDataTypeChange={handleDataTypeChange}
                        onDataTypeChange={(e) => {}}
                    />

                    <CircleMinus className="ml-3 mr-1"
                        style={{color : "#1c1d2359", cursor: "pointer"}}
                        // onClick={() => handleDeleteOutput(index)}
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

                    // handleAddOutput();
                    }}
                >
                    <Plus size={24} />
                    Add
                </CommonStyles.Button>
            </CollapseArea>
        </div>
    );
}

export default OutputSection;