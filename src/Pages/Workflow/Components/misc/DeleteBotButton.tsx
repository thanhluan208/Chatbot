import CommonStyles from "@/Components/CommonStyles";
import ConfirmDialog from "@/Components/CommonStyles/ConfirmDialog";
import useToggleDialog from "@/Hooks/useToggleDialog";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { Workflow } from "@/Types/workflow";
import { useTheme } from "@mui/material";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";

interface IDeleteButton {
  workflow: Workflow;
}

function DeleteBotButton(props: IDeleteButton) {
  //! State
  const { workflow } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const theme: any = useTheme();
  const { userId } = useAuth();
  const { handleDeleteWorkflow } = useWorkflowMutate();
  const { mutateAsync } = handleDeleteWorkflow;

  //! Function
  const handleDelete = async () => {
    if (!workflow.workflow_id || !userId) return;

    const toastId = toast.loading(`Deleting ${workflow.workflow_name}...`, {
      isLoading: true,
      autoClose: false,
    });

    const {data} = await mutateAsync({
      workflow_id: workflow.workflow_id,
      user_id: userId,
    });

    if(data.status_code === 200) {
      toast.update(toastId, {
        render: `Delete ${workflow.workflow_name} successfully`,
        type: "success",
        autoClose: 3000,
        isLoading: false,
      });
    }

    toggle();
  };

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
          <ConfirmDialog
            handleConfirm={handleDelete}
            content={`Confirm delete ${workflow.workflow_name}`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <CommonStyles.Typography
          type="semiBold14"
          color={theme.colors.custom.colorErrorTypo}
        >
          Delete
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteBotButton;
