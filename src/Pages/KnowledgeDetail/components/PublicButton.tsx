import CommonStyles from "@/Components/CommonStyles";
import { deleteFromStore, publishKnowledge } from "@/Constants/api";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { useGet } from "@/Stores/useStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";

const PublicButton = ({ isPublic }: { isPublic?: boolean }) => {
  //! State
  const { userId } = useAuth();
  const refetchDetails = useGet('REFETCH_KNOWLEDGE_DETAILS')

  const params = useParams();

  const knowledgeId = params.knowledgeId;

  //! Function
  const handlePublic = async () => {
    const toastId = toast.loading("Publishing knowledge...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.axios.post(publishKnowledge, {
        user_id: userId,
        knowledge_storage_id: knowledgeId,
      });

      refetchDetails && await refetchDetails()

      toast.update(toastId, {
        render: "Knowledge published successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: "Failed to publish knowledge",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleRemove = async () => {
    const toastId = toast.loading("Removing knowledge...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.axios.post(deleteFromStore, {
        user_id: userId,
        knowledge_storage_id: knowledgeId,
      });

      toast.update(toastId, {
        render: "Knowledge removed successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: "Failed to remove knowledge",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  //! Render
  return (
    <Fragment>
      <CommonStyles.Button onClick={isPublic ? handleRemove : handlePublic}>
        {isPublic ? "Remove from store" : "Publish to store"}
      </CommonStyles.Button>
    </Fragment>
  );
};

export default PublicButton;
