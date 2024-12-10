import CommonStyles from "@/Components/CommonStyles";
import { WORKFLOW_ICON } from "@/Constants/common";
import { useGet } from "@/Stores/useStore";
import { useTheme } from "@mui/material";
import { capitalize } from "lodash";
import { ResponseRunWorkflow } from "./type";

const Tracing = () => {
  const theme = useTheme();
  const runtimeWorkflow = useGet("WORKFLOW_RUNTIME") as ResponseRunWorkflow[];

  return (
    <div>
      {runtimeWorkflow?.map((elm) => {
        return (
          <div
            key={elm.event + elm.node_id}
            className="px-2 py-1 rounded-lg mt-2"
            style={{
              background: theme.colors.custom.backgroundCard,
              border: `1px solid ${theme.colors.custom.borderColor}`,
            }}
          >
            <div className="mt-1 px-3 py-1 flex items-center justify-between">
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-md"
                  style={{
                    background: theme.palette.primary.main,
                  }}
                >
                  {
                    WORKFLOW_ICON[
                      `customNode_WF_${elm.node_type.replace(
                        /_/g,
                        "-"
                      )}` as keyof typeof WORKFLOW_ICON
                    ]
                  }
                </div>
                <CommonStyles.Typography type="semiBold14">
                  {elm.node_id}
                </CommonStyles.Typography>
              </div>
              <div className="flex gap-2 items-center">
                <CommonStyles.Typography
                  type="semiBold14"
                  className="opacity-50"
                >
                  {((elm.finished_at - elm.start_at) * 1000).toFixed(2)}ms
                </CommonStyles.Typography>
                <div
                  className="rounded-md px-2 py-1"
                  style={{
                    background:
                      elm.running_status === "successful"
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                >
                  <CommonStyles.Typography type="semiBold10">
                    {capitalize(elm.running_status)}
                  </CommonStyles.Typography>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tracing;
