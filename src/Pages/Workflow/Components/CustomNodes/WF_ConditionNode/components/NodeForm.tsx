import { Formik } from "formik";
import { Fragment, useMemo } from "react";
import { Form, FieldArray } from "formik";
import { v4 as uuid } from "uuid";
import { Link2, Plus } from "lucide-react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";

interface NodeFormProps {}

const NodeForm = ({}: NodeFormProps) => {
  const theme = useTheme();
  const { getEdges } = useReactFlow();

  const handleid = useMemo(() => {
    return uuid();
  }, []);

  const initialValues = useMemo(() => {
    return {
      conditionsGroups: [
        {
          groupId: uuid(),
          conditions: [{ id: uuid(), input: "", value: "", comparator: "" }],
          compartor: "AND",
        },
      ],
    };
  }, []);
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => {
        return (
          <Form>
            <FieldArray
              name="conditionsGroups"
              render={(helper) => {
                return (
                  <div className="p-2">
                    <div className="flex flex-col">
                      {values.conditionsGroups.map((group, index) => {
                        return (
                          <CollapseArea
                            key={group.groupId}
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
                                    id={group.groupId}
                                    isConnectable={true}
                                    className="handle"
                                    isValidConnection={(connection) => {
                                      const edges = getEdges();

                                      const edgeToTarget = edges.filter(
                                        (elm) =>
                                          elm.target === connection.target
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
                            <div>
                              <FieldArray
                                name={`conditionsGroups[${index}].conditions`}
                                render={({ push }) => {
                                  return (
                                    <Fragment>
                                      <div className="flex flex-col gap-2 mb-2">
                                        {group.conditions.map((condition) => {
                                          return (
                                            <Box
                                              key={condition.id}
                                              className="p-2 rounded-lg flex gap-2 items-center"
                                              sx={{
                                                border: `1px solid ${theme.colors.custom.borderColor}`,
                                                background:
                                                  theme.colors.custom
                                                    .backgroundCard,
                                              }}
                                            >
                                              <div className="flex gap-1 items-center">
                                                <Link2
                                                  className="w-5 h-5 translate-y-0.5"
                                                  color={
                                                    theme.palette.primary.main
                                                  }
                                                />
                                                <CommonStyles.Typography
                                                  color={
                                                    theme.palette.primary.main
                                                  }
                                                  type="semiBold16"
                                                >
                                                  var
                                                </CommonStyles.Typography>
                                              </div>
                                            </Box>
                                          );
                                        })}
                                      </div>
                                      <CommonStyles.Button
                                        variant="outlined"
                                        onClick={() => {
                                          push({
                                            id: uuid(),
                                            input: "",
                                            value: "",
                                            comparator: "",
                                          });
                                        }}
                                      >
                                        <CommonStyles.Typography type="semiBold16">
                                          Add Condition
                                        </CommonStyles.Typography>
                                      </CommonStyles.Button>
                                    </Fragment>
                                  );
                                }}
                              />
                            </div>
                          </CollapseArea>
                        );
                      })}
                    </div>
                    <div className="px-3 mt-4">
                      <CommonStyles.Button
                        variant="contained"
                        onClick={() => {
                          helper.push({
                            groupId: uuid(),
                            conditions: [
                              {
                                id: uuid(),
                                input: "",
                                value: "",
                                comparator: "",
                              },
                            ],
                            compartor: "AND",
                          });
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        <CommonStyles.Typography
                          type="semiBold16"
                          color={"#fff"}
                        >
                          Add Case
                        </CommonStyles.Typography>
                      </CommonStyles.Button>
                    </div>
                    <div className="w-full px-2 mt-4 flex ">
                      <div className="relative flex pr-6 justify-end w-full">
                        <CommonStyles.Typography type="semiBold16">
                          ELSE
                        </CommonStyles.Typography>
                        <Handle
                          type="source"
                          position={Position.Right}
                          id={handleid}
                          isConnectable={true}
                          className="handle"
                          isValidConnection={(connection) => {
                            const edges = getEdges();

                            const edgeToTarget = edges.filter(
                              (elm) => elm.target === connection.target
                            );

                            return edgeToTarget.every((elm) =>
                              values.conditionsGroups.every(
                                (group) => group.groupId !== elm.sourceHandle
                              )
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default NodeForm;
