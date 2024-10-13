import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { KnowledgeActionDialog } from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/CreateKnowledgeButton";
import { useTranslation } from "react-i18next";

function CreateKnowledgeButton() {
  //Translation
  const { t } = useTranslation("store");

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
          {t("personal.work.button.createKnowledge")}
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateKnowledgeButton;
