import { Fragment } from "react/jsx-runtime";
import { Box, useTheme } from "@mui/material";
import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";

interface ICreateWorkFlowButton {}

function CreateWorkFlowButton(props: ICreateWorkFlowButton) {
  //! State
  const {} = props;
  const { open, shouldRender, toggle } = useToggleDialog();

  const theme: any = useTheme();
  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
        >
          <Box></Box>
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        onClick={toggle}
        sx={{
          padding: "9px 20px",
          width: "fit-content",
          height: "40px",
          background: theme.colors.custom.backgroundButtonHover,
        }}
      >
        <CommonStyles.Typography type="semiBold16">
          Submit workflow
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateWorkFlowButton;
