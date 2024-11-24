import CommonStyles from "@/Components/CommonStyles";
import { Group } from "./type";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import NodeVarItem from "./NodeVarItem";

interface NodeGroupItemProps {
  data: Partial<Group>[];
}

const NodeGroupItem = ({ data }: NodeGroupItemProps) => {
  const { t } = useTranslation("node");
  const theme = useTheme();

  return (
    <div className="flex px-3 w-full">
      {data?.map((item) => {
        return (
          <div key={item.group_name} className="w-full">
            <div className="flex items-center w-full justify-between">
              <CommonStyles.Typography type="semiBold16">
                {item.group_name || t("WF_VarAgg.assign_variables")}
              </CommonStyles.Typography>
              {item.output_type !== "none" && (
                <div
                  className="flex px-3 py-1 rounded-md"
                  style={{
                    backgroundColor: theme.colors.custom.backgroundCard,
                    border: `1px solid ${theme.colors.custom.borderColor}`,
                  }}
                >
                  {item.output_type}
                </div>
              )}
            </div>
            <div className="mt-3">
              {item?.variables?.map((vars) => {
                const nodeVarItemData = {
                  value: vars,
                  type: item.output_type as string,
                };

                return (
                  <NodeVarItem
                    key={`${vars?.[0]}-${vars?.[1]}`}
                    data={nodeVarItemData}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NodeGroupItem;
