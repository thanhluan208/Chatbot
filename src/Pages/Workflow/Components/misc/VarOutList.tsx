import CommonStyles from "@/Components/CommonStyles";
import { VariablesOut } from "@/Types/workflow";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

const VarOutList = ({ nodeData }: { nodeData: any }) => {
  const { t } = useTranslation("node");
  const theme = useTheme();
  return (
    <div className="mt-5 pl-3">
      <CommonStyles.Typography type="semiBold16">
        {t("common.variable_out")}
      </CommonStyles.Typography>
      <div className="flex flex-wrap gap-2 pl-3 mt-2">
        {nodeData?.variable_out?.map((elm: VariablesOut) => {
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
                }}
              >
                <CommonStyles.Typography type="semiBold16">
                  {elm.type}
                </CommonStyles.Typography>
              </div>
              <CommonStyles.Typography type="semiBold16">
                {elm.variable}
              </CommonStyles.Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VarOutList;
