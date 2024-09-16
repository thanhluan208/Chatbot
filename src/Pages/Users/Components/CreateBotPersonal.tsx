import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { CreateBotDialog } from "../../../Components/DefaultLayout/Components/CreateBotButton";

interface ICreateBotPersonal {}

function CreateBotPersonal(props: ICreateBotPersonal) {
  //! State
  const {} = props;
  const { open, shouldRender, toggle } = useToggleDialog();

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
        variant="contained"
        sx={{
          padding: "9px 20px",
          width: "fit-content",
          height: "40px",
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
