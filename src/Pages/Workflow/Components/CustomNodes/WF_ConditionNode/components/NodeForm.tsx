import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Box, Tooltip, useTheme } from "@mui/material";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Case } from "../type";
import { capitalize, isEmpty } from "lodash";
import { WORKFLOW_ICON } from "@/Constants/common";

interface NodeFormProps {
  cases: Case[];
  nodeId: string;
}

const NodeForm = ({ cases, nodeId }: NodeFormProps) => {
  const theme = useTheme();
  const { getEdges } = useReactFlow();

  const handleid = useMemo(() => {
    return uuid();
  }, []);

  return (
    <div className="p-2">
      <div className="flex flex-col">
        {cases &&
          cases.map((caseElm, index) => {
            return (
              <CollapseArea
                key={caseElm.case_id}
                label={
                  <div className="w-full flex justify-between">
                    <CommonStyles.Typography type="semiBold16">
                      {`Case ${index + 1}`}
                    </CommonStyles.Typography>
                    <div className="relative pr-6">
                      <CommonStyles.Typography type="semiBold16">
                        {index === 0 ? "IF" : "ELSE IF"}
                      </CommonStyles.Typography>
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={caseElm.case_id}
                        isConnectable={true}
                        className="handle"
                        isValidConnection={(connection) => {
                          const edges = getEdges();

                          const edgeToTarget = edges.filter(
                            (elm) => elm.target === connection.target
                          );

                          return edgeToTarget.every(
                            (elm) => elm.sourceHandle !== handleid
                          );
                        }}
                      />
                    </div>
                  </div>
                }
              >
                <div className="flex flex-col gap-4 mb-2">
                  {isEmpty(caseElm?.conditions) && (
                    <CommonStyles.Typography>
                      No conditions yet
                    </CommonStyles.Typography>
                  )}
                  {caseElm.conditions.map((condition, index) => {
                    return (
                      <Box
                        key={JSON.stringify(condition)}
                        className="px-4 py-3 relative rounded-lg flex gap-2 items-center"
                        sx={{
                          border: `1px solid ${theme.colors.custom.borderColor}`,
                          background: theme.colors.custom.backgroundCard,
                        }}
                      >
                        <Tooltip
                          title={`${condition?.variable_selector?.[1]} ${condition?.comparison_operator} ${condition?.value}`}
                        >
                          <div className="flex gap-1 items-center">
                            {
                              WORKFLOW_ICON[
                                `customNode_WF_${condition?.variable_selector?.[0]}` as keyof typeof WORKFLOW_ICON
                              ]
                            }
                            <CommonStyles.Typography
                              color={theme.palette.primary.main}
                              type="semiBold16"
                            >
                              {condition?.variable_selector?.[1]}
                            </CommonStyles.Typography>

                            <CommonStyles.Typography type="semiBold12">
                              {condition?.comparison_operator}
                            </CommonStyles.Typography>

                            <CommonStyles.Typography
                              color={theme.palette.primary.main}
                              type="semiBold16"
                              className="truncate max-w-[250px]"
                            >
                              {condition?.value}
                            </CommonStyles.Typography>
                          </div>
                        </Tooltip>

                        {index > 0 && (
                          <div
                            className="px-3 py-1 rounded-lg absolute left-2/4 -translate-x-2/4 -translate-y-[120%]"
                            style={{
                              border: `solid 1px ${theme.palette.primary.main}`,
                              background: theme.colors.custom.background,
                            }}
                          >
                            <CommonStyles.Typography type="semiBold12">
                              {capitalize(caseElm?.logical_operator)}
                            </CommonStyles.Typography>
                          </div>
                        )}
                      </Box>
                    );
                  })}
                </div>
              </CollapseArea>
            );
          })}
      </div>
      <div className="w-full px-2 mt-4 flex ">
        <div className="relative flex pr-6 justify-end w-full">
          <CommonStyles.Typography type="semiBold16">
            ELSE
          </CommonStyles.Typography>
          <Handle
            type="source"
            position={Position.Right}
            id={`${nodeId}-source`}
            isConnectable={true}
            className="handle"
            isValidConnection={(connection) => {
              const edges = getEdges();

              const edgeToTarget = edges.filter(
                (elm) => elm.target === connection.target
              );

              return edgeToTarget.every((elm) =>
                cases.every((caseElm) => caseElm.case_id !== elm.sourceHandle)
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NodeForm;
