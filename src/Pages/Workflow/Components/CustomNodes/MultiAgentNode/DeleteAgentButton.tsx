import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../../../Hooks/useToggleDialog";
import { toast } from "react-toastify";
import httpServices from "../../../../../Services/httpServices";
import { deleteBotNode } from "../../../../../Constants/api";
import CommonStyles from "../../../../../Components/CommonStyles";
import ConfirmDialog from "../../../../../Components/CommonStyles/ConfirmDialog";
import CommonIcons from "@/Components/CommonIcons";
import { useReactFlow } from "@xyflow/react";
import { useParams } from "react-router-dom";

interface IDeleteButton {
  id: string;
}

function DeleteAgentButton(props: IDeleteButton) {
  //! State
  const { id } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const { setNodes } = useReactFlow();
  const params = useParams();
  const botId = params.botId;

  //! Function
  const handleDelete = async () => {
    if (!id || !botId) return;

    const toastId = toast.loading(`Deleting agent ${id}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.axios.post(deleteBotNode, {
        bot_id: botId,
        node_id: id,
      });

      if (response.data.status_code === 200) {
        toast.update(toastId, {
          render: `Delete agent ${id} successfully`,
          type: "success",
          autoClose: 3000,
          isLoading: false,
        });

        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.log("Delete bot error: ", error.message);
      toast.update(toastId, {
        render: error?.message || `Delete agent ${id} failed`,
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
            content={`Confirm delete agent ${id}`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        isIcon
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <CommonIcons.Delete />
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteAgentButton;
