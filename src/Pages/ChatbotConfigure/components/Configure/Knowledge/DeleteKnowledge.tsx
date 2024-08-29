import { Fragment } from "react/jsx-runtime";
import { toast } from "react-toastify";
import { IKnowledgeFolder } from "./KnowledgeFolder";
import useToggleDialog from "../../../../../Hooks/useToggleDialog";
import { useGet } from "../../../../../Stores/useStore";
import CommonStyles from "../../../../../Components/CommonStyles";
import ConfirmDialog from "../../../../../Components/CommonStyles/ConfirmDialog";
import httpServices from "../../../../../Services/httpServices";
import { deleteKnowledge } from "../../../../../Constants/api";
import { useParams } from "react-router-dom";

interface IDeleteKnowledge {
  data: IKnowledgeFolder;
}

function DeleteKnowledge(props: IDeleteKnowledge) {
  //! State
  const { data } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const params = useParams();
  const refetchListFolderKnowledge = useGet("REFETCH_FOLDER_KNOWLEDGE");
  const userId = params?.id;

  //! Function
  const handleDelete = async () => {
    console.log('data', data, userId)
    if (!data.title || !data.id || !userId) return;

    const toastId = toast.loading(`Deleting ${data.title}...`, {
      isLoading: true,
      autoClose: false,
    });

    const payload = {
      user_id: userId,
      knowledge_storage_id: data.id,
    };

    try {
      await httpServices.axios.post(deleteKnowledge, payload);

      refetchListFolderKnowledge && (await refetchListFolderKnowledge());

      toast.update(toastId, {
        isLoading: false,
        render: "Deleted successfully",
        type: toast.TYPE.SUCCESS,
        autoClose: 2000,
      });

      toggle();
    } catch (error: any) {
      toast.update(toastId, {
        isLoading: false,
        render: error?.response?.data?.message || "Delete failed",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
      });

      console.log('Delete failed', error);
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
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <ConfirmDialog
            handleConfirm={handleDelete}
            content={`Confirm delete ${data.title}`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        color="error"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        variant="outlined"
        sx={{
          color: "#ff1515",
        }}
      >
        Delete
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteKnowledge;
