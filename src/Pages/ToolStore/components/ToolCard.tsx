import CommonStyles from "@/Components/CommonStyles";
import { formatName } from "@/Helpers";
import { Tool } from "@/Pages/Workflow/Components/Toolbar/type";
import { useTheme } from "@mui/material";
import { capitalize } from "lodash";

interface ToolCardProps {
  data: Tool;
}

const ToolCard = ({ data }: ToolCardProps) => {
  const theme = useTheme();

  return (
    <div
      className="rounded-lg p-3"
      style={{
        border: `1px solid ${theme.colors.custom.borderColor}`,
        background: theme.colors.custom.backgroundCard,
      }}
    >
      <div className="flex gap-2 mb-4">
        <img
          src={
            data.provider?.icon?.includes("icon.")
              ? "https://i.pinimg.com/736x/99/3e/b9/993eb9aa891797e59a40ab89b0648213.jpg"
              : data.provider?.icon
          }
          className="rounded-lg w-10 h-10 object-cover object-center translate-y-1"
        />
        <div>
          <CommonStyles.Typography
            type="semiBold16"
            className="max-w-[250px] truncate"
          >
            {formatName(data.name, "_")}
          </CommonStyles.Typography>
          {data.provider?.name && (
            <CommonStyles.Typography className="opacity-50 ">
              {formatName(data.provider?.name, "_")}
            </CommonStyles.Typography>
          )}
        </div>
      </div>
      <CommonStyles.Typography
        className="opacity-50 "
        sx={{
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          display: "-webkit-box",
          textAlign: "left",
          opacity: 0.5,
        }}
      >
        {data.description.human.en_US}
      </CommonStyles.Typography>

      <div className="flex flex-wrap gap-2 mt-3">
        {data.tags?.map((tag) => {
          return (
            <div
              key={tag}
              className="px-3 py-1 rounded-lg "
              style={{
                border: `1px solid ${theme.colors.custom.borderColor}`,
                background: theme.colors.custom.background,
              }}
            >
              <CommonStyles.Typography type="semiBold14">
                {capitalize(tag)}
              </CommonStyles.Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToolCard;
