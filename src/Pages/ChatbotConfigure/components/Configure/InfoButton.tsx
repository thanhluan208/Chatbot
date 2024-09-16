import { Box, Paper, Popper, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import { useState } from "react";
import CommonIcons from "../../../../Components/CommonIcons";

interface IParams {
  name: string;
  description: string;
  isRequired?: boolean;
  type: string;
}

const Params = (props: IParams) => {
  const { name, type, description, isRequired } = props;
  const theme: any = useTheme();
  return (
    <Box>
      <CommonStyles.Typography type="bold14">
        {name}
        <CommonStyles.Typography
          type="normal12"
          component="span"
          color={theme.colors.custom.normalColorTypo}
          sx={{ ml: 1 }}
        >
          {type}
        </CommonStyles.Typography>
        {isRequired && (
          <CommonStyles.Typography
            type="normal12"
            component="span"
            color={"#fc8800"}
            sx={{ ml: 1 }}
          >
            Required
          </CommonStyles.Typography>
        )}
      </CommonStyles.Typography>
      <CommonStyles.Typography
        type="normal12"
        color={theme.colors.custom.normalColorTypo}
      >
        {description}
      </CommonStyles.Typography>
    </Box>
  );
};

interface IInfoButton {
  id: string;
}
function InfoButton(props: IInfoButton) {
  //! State
  const { id } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const theme: any = useTheme();
  const open = Boolean(anchorEl);

  //! Function

  //! Render
  return (
    <Box onMouseLeave={() => setAnchorEl(null)}>
      <CommonStyles.Button
        isIcon
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
      >
        <CommonIcons.InfoOutlined />
      </CommonStyles.Button>
      <Popper
        open={open}
        id={id}
        anchorEl={anchorEl}
        sx={{
          "& .MuiPaper-root ": {
            borderRadius: "12px",
          },
        }}

        //   onClose={()}
      >
        <Paper
          sx={{
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            width: "224px",
            gap: "8px",
            "& button": {
              justifyContent: "start",
            },
          }}
        >
          <Box>
            <CommonStyles.Typography type="bold14">
              img2text:
            </CommonStyles.Typography>
            <CommonStyles.Typography
              type="normal12"
              color={theme.colors.custom.normalColorTypo}
            >
              answer user's question about the image
            </CommonStyles.Typography>
          </Box>
          <Params
            name="content"
            type="string"
            description="user's question about the image"
            isRequired
          />
          <Params
            name="img_url"
            type="string"
            description="image's url starting with http/https"
            isRequired
          />
        </Paper>
      </Popper>
    </Box>
  );
}

export default InfoButton;
