import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../../../Hooks/useToggleDialog";
import { useGet } from "../../../../../Stores/useStore";
import { Bot } from "../../../../../Hooks/Bot/useGetListBot";
import { toast } from "react-toastify";
import httpServices from "../../../../../Services/httpServices";
import { deleteBot } from "../../../../../Constants/api";
import CommonStyles from "../../../../../Components/CommonStyles";
import ConfirmDialog from "../../../../../Components/CommonStyles/ConfirmDialog";
import { useTheme } from "@mui/material";

interface IDeleteButton {
  bot: Bot;
}

function DeleteBotButton(props: IDeleteButton) {
  //! State
  const { bot } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const theme: any = useTheme();
  const refetchBotList = useGet("REFETCH_LIST_BOT");

  //! Function
  const handleDelete = async () => {
    if (!bot.bot_id) return;

    const toastId = toast.loading(`Deleting ${bot.bot_name}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.axios.post(deleteBot, {
        bot_id: bot.bot_id,
      });

      await refetchBotList();

      if (response.data.status_code === 200) {
        toast.update(toastId, {
          render: `Delete ${bot.bot_name} successfully`,
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
        render: error?.message || `Delete ${bot.bot_name} failed`,
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
            content={`Confirm delete ${bot.bot_name}`}
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
