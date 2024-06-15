import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import { useState } from "react";
import { Box, Collapse, useTheme } from "@mui/material";
import { AllQueryKeys, useGet } from "../../../../Stores/useStore";
import { useParams } from "react-router-dom";
import SectionButtonItem from "./SectionButtonItem";
import { isArray, isEmpty } from "lodash";

interface ISectionItem {
  content: string;
  title: string;
  isAutoAwesome?: boolean;
  name: string;
  handleAdd?: () => void;
}

function SectionItem(props: ISectionItem) {
  //! State
  const { content, title, isAutoAwesome, name } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const params = useParams();
  const { botId } = params as { botId: string };

  const list = useGet(`${botId}/${name}` as AllQueryKeys);

  //! Function
  const onClickAdd = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (props.handleAdd) {
      props.handleAdd();
    }
  };

  //! Render
  return (
    <Fragment>
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
              <CommonStyles.Button isIcon>
                <CommonIcons.AutoAwesome sx={{ height: 18, width: 18 }} />
              </CommonStyles.Button>
            )}
            <CommonStyles.Button isIcon onClick={onClickAdd}>
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
                  avatar={item?.avatar}
                  title={item?.title}
                  subTitle={item?.subTitle}
                  id={item?.id}
                  key={item?.id}
                />
                // <SectionButtonItem
                //   avatar="https://lf16-alice-tos-sign.oceanapi-i18n.com/obj/ocean-cloud-tos-sg/plugin_icon/7304214883296691202_1709124525992516552_523YvDutnS.png?lk3s=cd508e2b&x-expires=1717920653&x-signature=myQw4ZrWUb5h12BW%2FhsxEgDsQe0%3D"
                //   title="GPT4V/img2text"
                //   subTitle="answer user's question about the image"
                //   id="1"
                // />
              );
            })
          ) : (
            <CommonStyles.Typography
              type="normal14"
              color={theme.colors.custom.colorDisabledTypo}
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
