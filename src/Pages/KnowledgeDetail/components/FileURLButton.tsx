import { Fragment } from "react/jsx-runtime";
import CommonIcons from "../../../Components/CommonIcons";
import CommonStyles from "../../../Components/CommonStyles";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import FileURLDocumentDialog from "./Dialog/FileURLDocumentUpload";

const FileURLButton = () => {
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
          <FileURLDocumentDialog toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button onClick={toggle} startIcon={<CommonIcons.Link />}>
        <CommonStyles.Typography type="normal14">
          File URL upload
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
};

export default FileURLButton;
