import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { KnowledgeActionDialog } from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/CreateKnowledgeButton";

function CreateKnowledgeButton() {
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
          <KnowledgeActionDialog toggle={toggle} />
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
          Create knowledge folder
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateKnowledgeButton;
