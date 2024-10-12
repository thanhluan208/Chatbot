import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import { useCallback, useState } from "react";
import { Box, Collapse, useTheme } from "@mui/material";
import SectionButtonItem from "./SectionButtonItem";
import { isArray, isEmpty } from "lodash";
import useToggleDialog from "../../../../Hooks/useToggleDialog";
import KnowledgeListDialog from "./Knowledge/KnowledgeListDialog";
import { KnowledgeStorage } from "@/Hooks/Bot/useGetBotData";

interface ISectionItem {
  content: string;
  title: string;
  isAutoAwesome?: boolean;
  sectionTitle: string;
  list: KnowledgeStorage[];
}

function SectionItem(props: ISectionItem) {
  //! State
  const { content, title, isAutoAwesome, sectionTitle, list } = props;
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
          maxWidth="lg"
          fullWidth
        >
          <KnowledgeListDialog toggle={toggle} />
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
          {isArray(list) && !isEmpty(list) ? (
            list.map((item) => {
              return (
                <SectionButtonItem
                  title={item?.knowledge_storage_name}
                  permission_level={item?.permission_level}
                  id={item?.knowledge_storage_id}
                  key={
                    item?.knowledge_storage_id + item?.knowledge_storage_name
                  }
                />
              );
            })
          ) : (
            <CommonStyles.Typography
              type="normal14"
              color={theme.colors.custom.normalColorTypo}
            >
              {content}
            </CommonStyles.Typography>
          )}
        </Box>
      </Collapse>
    </Fragment>
  );
}

export default SectionItem;
