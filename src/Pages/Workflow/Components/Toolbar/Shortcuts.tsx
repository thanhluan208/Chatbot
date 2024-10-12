import CommonIcons from "@/Components/CommonIcons";
import Copy from "@/Components/CommonIcons/Copy";
import DeleteTrash from "@/Components/CommonIcons/DeleteTrash";
import MousePointer from "@/Components/CommonIcons/MousePointer";
import Paste from "@/Components/CommonIcons/Paste";
import Redo from "@/Components/CommonIcons/Redo";
import Undo from "@/Components/CommonIcons/Undo";
import ZoomIn from "@/Components/CommonIcons/ZoomIn";
import ZoomOut from "@/Components/CommonIcons/ZoomOut";
import CommonStyles from "@/Components/CommonStyles";
import { Box, ClickAwayListener, Fade, Popper, useTheme } from "@mui/material";
import { memo, useState } from "react";

const ShortcutItem = memo(
  ({
    icon,
    title,
    keys,
  }: {
    icon: React.ReactNode;
    title: string;
    keys: string[];
    isodd?: boolean;
  }) => {
    const theme = useTheme();
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: theme.colors.custom.backgroundDialog,
          borderRadius: "8px",
          padding: "10px 20px",
          border: "1px solid transparent",
          "&:hover": {
            background: theme.colors.custom.backgroundCardHover,
            border: `1px solid ${theme.palette.primary.main}`,
            boxShadow: "0 5px 10px rgba(0,0,0,0.2s)",
          },
          svg: {
            width: "14px",
            height: "14px",
          },
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {icon}
          <CommonStyles.Typography type="semiBold16">
            {title}
          </CommonStyles.Typography>
        </Box>

        <Box sx={{ display: "flex", gap: "4px" }}>
          {keys.map((key) => {
            return (
              <Box
                sx={{
                  background: theme.colors.custom.backgroundSecondary,
                  padding: "4px 12px",
                  borderRadius: "10px",
                }}
              >
                <CommonStyles.Typography type="bold12">
                  {key}
                </CommonStyles.Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
);

let modifierKeyPrefix = "Ctrl"; // control key
if (
  navigator.platform.indexOf("Mac") === 0 ||
  navigator.platform === "iPhone"
) {
  modifierKeyPrefix = "⌘"; // command key
}

const shortcutData = [
  {
    icon: <Copy />,
    title: "Copy",
    keys: [`${modifierKeyPrefix}`, "C"],
  },
  {
    icon: <Paste />,
    title: "Paste",
    keys: [`${modifierKeyPrefix}`, "V"],
  },
  {
    icon: <ZoomIn />,
    title: "Zoom In",
    keys: [`${modifierKeyPrefix}`, "+"],
  },
  {
    icon: <ZoomOut />,
    title: "Zoom Out",
    keys: [`${modifierKeyPrefix}`, "-"],
  },
  {
    icon: <Undo />,
    title: "Undo",
    keys: [`${modifierKeyPrefix}`, "Z"],
  },
  {
    icon: <Redo />,
    title: "Redo",
    keys: [`${modifierKeyPrefix}`, "Y"],
  },
  {
    icon: <MousePointer />,
    title: "Multi-select",
    keys: [`${modifierKeyPrefix}`, "Click"],
  },
  {
    icon: <DeleteTrash />,
    title: "Delete",
    keys: ["Delete / Backspace"],
  },
];

const Shortcuts = () => {
  //! State
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();

  //! Function

  //! Render
  const open = Boolean(anchorEl);
  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box>
        <Popper
          open={!!open}
          anchorEl={anchorEl}
          placement={"top-end"}
          transition
          keepMounted={false}
          modifiers={[
            {
              name: "arrow",
              enabled: true,
            },
          ]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box
                sx={{
                  width: "350px",
                  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  marginBottom: "20px",
                  backdropFilter: "blur(10px)",
                  background: theme.colors.custom.backgroundCard,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <CommonStyles.Typography type="semiBold16">
                    Shortcuts
                  </CommonStyles.Typography>

                  <CommonStyles.Button
                    isIcon
                    onClick={() => setAnchorEl(null)}
                    tooltip="Close"
                  >
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    overflow: "hidden",
                    gap: "12px",
                  }}
                >
                  {shortcutData.map((item, index) => {
                    return (
                      <ShortcutItem
                        icon={item.icon}
                        title={item.title}
                        keys={item.keys}
                        isodd={index % 2 === 1}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Fade>
          )}
        </Popper>

        <CommonStyles.Button
          isIcon
          onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
          tooltip="Shortcuts"
          className="iconBtn"
        >
          <CommonIcons.HelpOutline />
        </CommonStyles.Button>
      </Box>
    </ClickAwayListener>
  );
};

export default Shortcuts;
