import { Fragment } from "react/jsx-runtime";
import { toast } from "react-toastify";
import { FileData } from "../../../Hooks/Knowledges/useGetListFolderKnowledge";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { useGet } from "../../../Stores/useStore";
import CommonStyles from "../../../Components/CommonStyles";
import ConfirmDialog from "../../../Components/CommonStyles/ConfirmDialog";
import CommonIcons from "../../../Components/CommonIcons";
import httpServices from "../../../Services/httpServices";
import { deleteFile } from "../../../Constants/api";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

interface IDeleteFileButton {
  file: FileData;
}

function DeleteFileButton(props: IDeleteFileButton) {
  //! State
  const { file } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const params = useParams();
  const userId = params.id;
  const knowledgeFolderId = params.knowledgeId;
  const refetchListFiles = useGet("REFETCH_KNOWLEDGE_DETAILS");
  const [loading, setLoading] = useState(false);

  //! Function
  const handleDelete = async () => {
    if (!file.name || !userId || !knowledgeFolderId) return;

    setLoading(true);
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
      setLoading(false);
    } catch (error: any) {
      toast.update(toastId, {
        isLoading: false,
        render: error?.response?.data?.message || "Delete failed",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
      });
      setLoading(false);

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
            loading={loading}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        isIcon
        isRound={false}
        color="error"
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation();
          if (loading) return;
          toggle();
        }}
      >
        {loading ? (
          <CircularProgress size={14} />
        ) : (
          <CommonIcons.Delete
            sx={{
              fill: "red",
            }}
          />
        )}
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteFileButton;
