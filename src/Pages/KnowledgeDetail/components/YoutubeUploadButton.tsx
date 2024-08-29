import { Fragment } from "react/jsx-runtime";
import CommonIcons from "../../../Components/CommonIcons";
import CommonStyles from "../../../Components/CommonStyles";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import YoutubeDocument from "./Dialog/YoutubeDocument";

const YoutubeUploadButton = () => {
  //! State
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
          <YoutubeDocument toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button onClick={toggle} startIcon={<CommonIcons.YouTube />}>
        <CommonStyles.Typography type="normal14">
          Youtube upload
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
};

export default YoutubeUploadButton;
