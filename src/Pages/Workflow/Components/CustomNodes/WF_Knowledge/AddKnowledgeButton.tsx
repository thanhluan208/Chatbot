import CommonStyles from "@/Components/CommonStyles";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import KnowledgeListDialog from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeListDialog";
import { cloneDeep } from "lodash";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

interface AddKnowledgeButtonProps {
  knowledges: string[];
  nodeId: string;
}

const AddKnowledgeButton = ({
  knowledges,
  nodeId,
}: AddKnowledgeButtonProps) => {
  const { t } = useTranslation("node");
  const [open, setOpen] = useState(false);

  const { handleUpdateNodeDataKnowledge } = useWorkflowMutate();

  const handleClose = () => setOpen(false);

  const handleMutateKnowledgeFolder = (id: string) => {
    if (knowledges.includes(id)) {
      handleUpdateNodeDataKnowledge(nodeId, {
        knowledge_storage_ids: cloneDeep(
          knowledges.filter((elm) => elm !== id)
        ),
      });
    } else {
      handleUpdateNodeDataKnowledge(nodeId, {
        knowledge_storage_ids: cloneDeep([...knowledges, id]),
      });
    }
  };
  return (
    <Fragment>
      {open && (
        <CommonStyles.Dialog
          open={open}
          toggle={handleClose}
          maxWidth="lg"
          fullWidth
        >
          <KnowledgeListDialog
            toggle={handleClose}
            enableButton
            handleMutate={handleMutateKnowledgeFolder}
            ownedOnly
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        variant="contained"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {t("common.add", { content: t("WF_Knowledge.knowledge") })}
      </CommonStyles.Button>
    </Fragment>
  );
};

export default AddKnowledgeButton;
