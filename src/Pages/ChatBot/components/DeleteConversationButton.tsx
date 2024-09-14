import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { useGet } from "@/Stores/useStore";
import httpServices from "@/Services/httpServices";
import { toast } from "react-toastify";
import { deleteConversation } from "@/Constants/api";
import CommonStyles from "@/Components/CommonStyles";
import ConfirmDialog from "@/Components/CommonStyles/ConfirmDialog";
import CommonIcons from "@/Components/CommonIcons";

interface IDeleteButton {
  id: string;
}

function DeleteConversationButton(props: IDeleteButton) {
  //! State
  const { id } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const refetchConversation = useGet("REFETCH_CONVERSATION");
  const refetchListChat = useGet("REFETCH_LIST_CHAT");

  //! Function
  const handleDelete = async () => {
    if (!id) return;

    const toastId = toast.loading(`Deleting conversation ${id}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.axios.post(deleteConversation, {
        conversation_id: id,
      });

      refetchConversation && (await refetchConversation());
      refetchListChat && (await refetchListChat());

      if (response.data.status_code === 200) {
        toast.update(toastId, {
          render: `Delete conversation ${id} successfully`,
          type: "success",
          autoClose: 3000,
          isLoading: false,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.log("Delete bot error: ", error.message);
      toast.update(toastId, {
        render: error?.message || `Delete conversation ${id} failed`,
        type: "error",
        autoClose: 2000,
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
            content={`Confirm delete conversation ${id}`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        isIcon
        color="error"
        className="delete-button"
        sx={{
          width: "0px !important",
          padding: "0px !important",
          opacity: 0,
          transition: "all 0.3s",
          borderRadius: "8px",
        }}
      >
        <CommonIcons.Delete />
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteConversationButton;
