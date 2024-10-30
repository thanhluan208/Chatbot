import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../../Components/CommonStyles";
import useToggleDialog from "../../../../Hooks/useToggleDialog";
import { useTranslation } from "react-i18next";
import CreateOrEditWorkflowDialog from "./CreateOrEditWorkflowDialog";

function CreateWorkFlowButton() {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();
  const { t } = useTranslation("node");

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
          <CreateOrEditWorkflowDialog toggle={toggle} />
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
        <CommonStyles.Typography type="semiBold16" color="#fff">
          {t("WF_mutate_dialog.create.title")}
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateWorkFlowButton;
