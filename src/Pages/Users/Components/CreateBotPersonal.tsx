import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import { useTheme } from "@mui/material";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { CreateBotDialog } from "../../../Components/DefaultLayout/Components/CreateBotButton";

interface ICreateBotPersonal {}

function CreateBotPersonal(props: ICreateBotPersonal) {
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
          <CreateBotDialog toggle={toggle} />
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
          Create bot
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateBotPersonal;
