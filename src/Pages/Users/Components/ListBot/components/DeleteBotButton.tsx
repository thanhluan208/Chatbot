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
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useTranslation } from "react-i18next";

interface IDeleteButton {
  bot: Bot;
}

function DeleteBotButton(props: IDeleteButton) {
  //Translation
  const { t } = useTranslation("store");
  //! State
  const { bot } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const theme: any = useTheme();
  const refetchBotList = useGet("REFETCH_LIST_BOT");
  const {userId} = useAuth()

  //! Function
  const handleDelete = async () => {
    if (!bot.bot_id) return;

    const toastId = toast.loading(t("common.toast.deleting", {param: bot.bot_name}), {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.axios.post(deleteBot, {
        bot_id: bot.bot_id,
        user_id: userId
      });

      await refetchBotList();

      if (response.data.status_code === 200) {
        toast.update(toastId, {
          render: t("common.toast.deleteSuccess", {param: bot.bot_name}),
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
        render: error?.message || t("common.toast.deleteFail", {param: bot.bot_name}),
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
            content={`${t("common.button.confirm")} ${t("common.button.delete").toLowerCase()} ${bot.bot_name}`}
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
         {t("common.button.delete")}
        </CommonStyles.Typography>
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteBotButton;
