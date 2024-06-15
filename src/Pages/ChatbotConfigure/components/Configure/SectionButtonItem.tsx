import { Box, Tooltip, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import { memo, useState } from "react";
import CommonIcons from "../../../../Components/CommonIcons";
import InfoButton from "./InfoButton";

interface ISectionButtonItem {
  avatar: string;
  title: string;
  subTitle: string;
  id: string;
}

function SectionButtonItem(props: ISectionButtonItem) {
  //! State
  const { avatar, id, subTitle, title } = props;
  const theme = useTheme();

  const [showAction, setShowAction] = useState(false);
  //! Function

  //! Render
  return (
    <CommonStyles.Button
      fullWidth
      onMouseEnter={() => setShowAction(true)}
      onMouseLeave={() => setShowAction(false)}
      sx={{
        gap: "8px",
        color: "#000",
        maxWidth: "unset",
        height: "fit-content",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        "& p": {
          maxWidth: "calc(100vw/7*2 - 86px)",
          textWrap: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }}
    >
      <img src={avatar} height={36} width={36} />
      <Box>
        <CommonStyles.Typography type="semiBold14">
          {title}
        </CommonStyles.Typography>
        <CommonStyles.Typography
          type="normal12"
          color={theme.colors.custom.colorDisabledTypo}
        >
          {subTitle}
        </CommonStyles.Typography>
      </Box>
      <Box
        sx={{
          opacity: showAction ? 1 : 0,
          transition: "opacity 0.3s",
          display: "flex",
          position: "absolute",
          alignItems: "center",
          bottom: "0",
          right: "0",
          padding: "0 8px",
          background: "#4e40e50a",
          height: "100%",
          gap: "4px",
          svg: {
            height: "14px",
            width: "14px",
          },
          button: {
            height: "24px",
            width: "24px",
          },
          backdropFilter: "blur(400px)",
        }}
      >
        <InfoButton id="1" />
        <CommonStyles.Button isIcon>
          <Tooltip title="Copy">
            <CommonIcons.ContentCopyOutlined />
          </Tooltip>
        </CommonStyles.Button>
        <CommonStyles.Button isIcon>
          <Tooltip title="Card data binding">
            <CommonIcons.AddCardOutlined />
          </Tooltip>
        </CommonStyles.Button>
        <CommonStyles.Button isIcon>
          <Tooltip title="Edit parameters">
            <CommonIcons.SettingsOutlined />
          </Tooltip>
        </CommonStyles.Button>
        <CommonStyles.Button isIcon>
          <Tooltip title="Delete">
            <CommonIcons.DeleteOutlined />
          </Tooltip>
        </CommonStyles.Button>
      </Box>
    </CommonStyles.Button>
  );
}

export default memo(SectionButtonItem);
