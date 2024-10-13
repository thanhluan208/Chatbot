import CommonStyles from "@/Components/CommonStyles";
import useGetListBot from "@/Hooks/Bot/useGetListBot";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import SubmitBotDialog from "./SubmitBotDialog";

const filters = {
  visual_option: "owned",
};

const SubmitBotButton = () => {
  //! State
  const { t } = useTranslation("store");
  const { data, isLoading } = useGetListBot(filters);
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
          onClick={(e) => e.stopPropagation()}
        >
          <SubmitBotDialog data={data?.data?.list_bots.filter(bot => bot.visibility === "private") || []} toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        variant="contained"
        disabled={isLoading}
        onClick={toggle}
      >
        {t("botStore.button.submitBot")}
      </CommonStyles.Button>
    </Fragment>
  );
};

export default SubmitBotButton;
