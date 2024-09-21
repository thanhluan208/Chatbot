import { Fragment } from "react/jsx-runtime";
import { toast } from "react-toastify";
import { TestPDF } from "../../../Hooks/Knowledges/useGetListFolderKnowledge";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { useGet } from "../../../Stores/useStore";
import CommonStyles from "../../../Components/CommonStyles";
import ConfirmDialog from "../../../Components/CommonStyles/ConfirmDialog";
import CommonIcons from "../../../Components/CommonIcons";
import httpServices from "../../../Services/httpServices";
import { deleteFile } from "../../../Constants/api";
import { useParams } from "react-router-dom";

interface IDeleteFileButton {
  file: TestPDF;
}

function DeleteFileButton(props: IDeleteFileButton) {
  //! State
  const { file } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const params = useParams();
  const userId = params.id;
  const knowledgeFolderId = params.knowledgeId;
  const refetchListFiles = useGet("REFETCH_KNOWLEDGE_FILES");

  //! Function
  const handleDelete = async () => {
    if (!file.name || !userId || !knowledgeFolderId) return;

    const toastId = toast.loading(`Deleting ${file.name}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.axios.post(deleteFile, {
        user_id: userId,
        knowledge_storage_id: knowledgeFolderId,
        file_name_input: file.name,
      });

      refetchListFiles && (await refetchListFiles());

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

      console.log("Delete failed", error);
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
            content={`Confirm delete ${file.name}`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        isIcon
        isRound={false}
        color="error"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <CommonIcons.Delete
          sx={{
            fill: "red",
          }}
        />
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteFileButton;
