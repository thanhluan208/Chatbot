import CommonStyles from "@/Components/CommonStyles";
import { deleteFromStore, publishKnowledge } from "@/Constants/api";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";

const PublicButton = () => {
  //! State
  const pathName = useLocation().pathname;
  const { userId } = useAuth();

  const [isPublic, setIsPublic] = useState(
    pathName.includes("knowledge-store") 
  );
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

      setIsPublic(true);
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

      setIsPublic(false);
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
