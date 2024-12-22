import { Box, Collapse, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import CommonIcons from "../../../../Components/CommonIcons";
import CommonStyles from "../../../../Components/CommonStyles";
import useToggleDialog from "../../../../Hooks/useToggleDialog";
import UploadBackgroundDialog from "./ChatExperience/UploadBackgroundDialog";

interface ISectionChatExperience {
  content: string;
  title: string;
  isAutoAwesome?: boolean;
  sectionTitle: string;
}

function SectionChatExperience(props: ISectionChatExperience) {
  //! State
  const { content, title, isAutoAwesome, sectionTitle } = props;
  const [open, setOpen] = useState(false);
  const theme: any = useTheme();

  const { open: openDialog, shouldRender, toggle } = useToggleDialog();

  //! Function
  const renderDialog = useCallback(() => {
    if (true) {
      return (
        <CommonStyles.Dialog
          open={openDialog}
          toggle={toggle}
          maxWidth="md"
          fullWidth
        >
          <UploadBackgroundDialog toggle={toggle} />
        </CommonStyles.Dialog>
      );
    }
  }, [sectionTitle, openDialog, toggle]);

  //! Render
  return (
    <Fragment>
      {shouldRender && renderDialog()}
      <CommonStyles.Button
        onClick={() => setOpen(!open)}
        fullWidth
        startIcon={
          <CommonIcons.KeyboardArrowRight
            sx={{
              transition: "transform 0.3s",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        }
        sx={{
          height: "fit-content",
          mb: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            color: "#000",
          }}
        >
          <CommonStyles.Typography type="bold14">
            {title}
          </CommonStyles.Typography>
          <Box
            sx={{
              button: {
                padding: "2px",
                height: "24px",
                width: "24px",
              },
            }}
          >
            {isAutoAwesome && (
              <CommonStyles.Button isIcon hasBorder={false}>
                <CommonIcons.AutoAwesome sx={{ height: 18, width: 18 }} />
              </CommonStyles.Button>
            )}
            <CommonStyles.Button
              isIcon
              hasBorder={false}
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
            >
              <CommonIcons.Add sx={{ height: 18, width: 18 }} />
            </CommonStyles.Button>
          </Box>
        </Box>
      </CommonStyles.Button>
      <Collapse in={open}>
        <Box px="20px">
          <CommonStyles.Typography
            type="normal14"
            color={theme.colors.custom.normalColorTypo}
          >
            {content}
          </CommonStyles.Typography>
        </Box>
      </Collapse>
    </Fragment>
  );
}

export default SectionChatExperience;
