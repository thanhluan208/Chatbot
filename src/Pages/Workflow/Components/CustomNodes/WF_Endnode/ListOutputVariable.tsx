import { useTheme } from "@mui/material";
import { Output } from "./type";
import CommonStyles from "@/Components/CommonStyles";
import { isEmpty } from "lodash";
import { WORKFLOW_ICON } from "@/Constants/common";

interface ListOutputVariableProps {
  data: Output[];
}

const ListOutputVariable = ({ data }: ListOutputVariableProps) => {
  const theme = useTheme();

  return (
    <div className="flex flex-wrap gap-2 pl-3 mt-2 max-w-[500px]">
      {data?.map((elm) => {
        return (
          <div
            key={elm.variable}
            className="rounded-lg flex items-center overflow-hidden w-fit pr-3 gap-2"
            style={{
              border: `1px solid ${theme.colors.custom.borderColor}`,
            }}
          >
            <div
              className="px-3 py-3"
              style={{
                background: theme.colors.custom.background,
                borderRight: `1px solid ${theme.colors.custom.borderColor}`,
              }}
            >
              <CommonStyles.Typography type="semiBold16">
                {elm.variable}
              </CommonStyles.Typography>
            </div>
            {!isEmpty(elm.value_selector) && (
              <div className="flex gap-1 items-center">
                <div className="translate-y-0.5">
                  {
                    WORKFLOW_ICON[
                      `customNode_WF_${elm.value_selector?.[0].replace(
                        /_/g,
                        "-"
                      )}` as keyof typeof WORKFLOW_ICON
                    ]
                  }
                </div>
                <CommonStyles.Typography type="semiBold16">
                  {elm.value_selector?.[0]} -
                </CommonStyles.Typography>
                <CommonStyles.Typography type="semiBold16">
                  {elm.value_selector?.[1]}
                </CommonStyles.Typography>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListOutputVariable;
