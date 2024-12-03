import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import Hint from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Hint";
import { Box } from "@mui/material";
import { CircleMinus, Plus } from "lucide-react";
import OutputRow from "./OutputRow";
import { Outputs } from "../type";
import { v4 as uuid } from 'uuid'
import React from "react";

interface OutputSectionProps {
    nodeId: string;
    outputs: Outputs;
    handleUpdateNodeData: (nodeId: string, payload: any) => void;
}

const outputsUuid: string[] = [];

const OutputSection = ({ nodeId, outputs, handleUpdateNodeData }: OutputSectionProps) => {

    const [rerenderFlag, setRerenderFlag] = React.useState(false);

    Object.entries(outputs).forEach(() => {
        outputsUuid.push(uuid());
    });

    function handleAddOutput() {
        let key = "";
        let i = 0;
        do {
            key = `var_${i}`;
            i++;
          } while (outputs[key]);

        const updatedOutputs: Outputs = {
            ...outputs,
            [key]: {type: "String"}
        };
        outputs = updatedOutputs;

        handleOutputChange();
        setRerenderFlag((prev) => !prev);
    }

    function handleDeleteOutput(key: string) {
        if (!outputs[key]) {
            return;
        }

        delete outputs[key];
        setRerenderFlag((prev) => !prev);
        handleOutputChange();
    }

    function handleOnOutputKeyChange(key: string, newKey: string) {
        if (!outputs[key]) {
            return;
        }

        const newValue = outputs[key];
        delete outputs[key];
        const updatedOutputs: Outputs = {
            ...outputs,
            [newKey]: newValue
        };
        outputs = updatedOutputs;

        handleOutputChange();
        setRerenderFlag((prev) => !prev);
    }

    function handleOutputChange() {
        handleUpdateNodeData(nodeId, {
            outputs: outputs,
        });
    }

    return (
        <div style={{ background: "#2e2d380a", borderRadius: "8px" }}>
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
                    style={{ fontSize: "12px", color: "#1c1d2359" }}>
                    <div style={{ flex: "0.8 1" }}>Variable name</div>
                    <div className="w-40">Variable type</div>
                </div>

                {Object.entries(outputs).map(([key, value], index) => (
                    <div
                        className="flex items-center justify-between justify-items-center ml-2 mt-2"
                        key={outputsUuid[index]}>
                        <OutputRow
                            outputKey={key}
                            output={value}
                            handleOnDataChange={handleOutputChange}
                            handleOnOutputKeyChange={handleOnOutputKeyChange}
                        />

                        <CircleMinus className="ml-3 mr-1"
                            style={{ color: "#1c1d2359", cursor: "pointer" }}
                            onClick={() => handleDeleteOutput(key)}
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

                        handleAddOutput();
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